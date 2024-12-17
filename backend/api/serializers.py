from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
from .models import Category, Post, Comment, UserProfile


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    bio = serializers.CharField(write_only=True, required=True)
    photo = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "bio",
            "photo",
        ]

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        validated_data["email"] = validated_data["email"].lower().strip()

        # Extract bio and photo
        bio = validated_data.pop("bio")
        photo = validated_data.pop("photo")

        # Create user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        # Create UserProfile instance
        UserProfile.objects.create(user=user, bio=bio, photo=photo)

        return user


# Login Serializer
class LoginTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login = attrs.get("username")  # Allow username or email
        password = attrs.get("password")

        if not login:
            raise serializers.ValidationError({"username": "This field is required."})

        # Check if login is email or username
        user = None
        if "@" in login:  # Email
            try:
                user = User.objects.get(email=login.lower().strip())
            except User.DoesNotExist:
                raise AuthenticationFailed("No user found with this email address.")
        else:  # Username
            try:
                user = User.objects.get(username=login)
            except User.DoesNotExist:
                raise AuthenticationFailed("No user found with this username.")

        # Validate password
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password.")

        # Set username for parent serializer validation
        attrs["username"] = user.username

        # Generate tokens
        data = super().validate(attrs)

        # Add username to the response
        data["username"] = user.username

        return data


# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    slug = serializers.SerializerMethodField()  # Accept slug for creating a comment
    user_image = serializers.SerializerMethodField()  # Fetch user image dynamically
    username = serializers.SerializerMethodField()  # Fetch user name dynamically

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "slug",
            "name",
            "email",
            "content",
            "created_at",
            "user_image",
            "username",
        ]
        read_only_fields = ["post", "created_at"]

    def validate_slug(self, value):
        # Ensure the slug corresponds to an existing post
        try:
            Post.objects.get(slug=value)
        except Post.DoesNotExist:
            raise serializers.ValidationError("No post found with this slug.")
        return value

    def get_slug(self, obj):
        # Fetch the slug of the related post
        if obj.post:
            return obj.post.slug
        return None

    def create(self, validated_data):
        # Extract slug and get the associated post
        slug = validated_data.pop("slug")
        post = Post.objects.get(slug=slug)
        validated_data["post"] = post
        return super().create(validated_data)

    def get_user_image(self, obj):
        try:
            # Find user by email
            user = User.objects.get(email=obj.email)
            # Check if the user has a profile with a photo
            if user.profile and user.profile.photo:
                return user.profile.photo.url
        except User.DoesNotExist:
            pass  # User doesn't exist

        return "not found"  # Default value

    def get_username(self, obj):
        try:
            user = User.objects.get(email=obj.email)
            return user.username  # Return the username if the user exists
        except User.DoesNotExist:
            return "not found"  # Return 'not found' if no user is found


# PostSerializer
class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    author_image = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.name", read_only=True)
    comments = serializers.SerializerMethodField()
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )
    image = serializers.ImageField(required=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "excerpt",
            "content",
            "slug",
            "image",
            "author",
            "author_image",
            "category",
            "category_id",
            "comments",
            "created_at",
            "updated_at",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make image optional for updates
        if self.instance is not None:  # If this is an update
            self.fields['image'].required = False

    def get_comments(self, obj):
        # Sort comments by latest created_at first
        comments = obj.comments.all().order_by("-created_at")
        return CommentSerializer(comments, many=True).data

    def get_author_image(self, obj):
        if obj.author.profile and obj.author.profile.photo:
            return obj.author.profile.photo.url
        return None  # or return a default image URL


# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


# Category Detail Serializer
class CategoryDetailSerializer(serializers.ModelSerializer):
    posts = PostSerializer(source="posts.all", many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "description", "posts"]


# UserSerializer
class UserSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source="profile.bio", read_only=True)
    photo = serializers.ImageField(source="profile.photo", read_only=True)
    posts = PostSerializer(
        source="posts.all", many=True, read_only=True
    )  # Nested serializer

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "bio",
            "photo",
            "posts",
        ]
