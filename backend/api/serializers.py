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


# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(write_only=True)  # Accept slug for creating a comment

    class Meta:
        model = Comment
        fields = ["id", "post", "slug", "name", "email", "content", "created_at"]
        read_only_fields = ["post", "created_at"]

    def validate_slug(self, value):
        # Ensure the slug corresponds to an existing post
        try:
            Post.objects.get(slug=value)
        except Post.DoesNotExist:
            raise serializers.ValidationError("No post found with this slug.")
        return value

    def create(self, validated_data):
        slug = validated_data.pop("slug")  # Extract the slug from validated data
        post = Post.objects.get(slug=slug)  # Fetch the post using the slug
        validated_data["post"] = post  # Assign the post to the comment
        return super().create(validated_data)


# PostSerializer
class PostSerializer(serializers.ModelSerializer):
    author = (
        serializers.StringRelatedField()
    )  # Use string representation of the author (or reference user serializer lazily)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )
    comments = CommentSerializer(
        many=True, read_only=True
    )  # Include all comments related to the post
    image = serializers.ImageField(required=True)  # Include image field

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "slug",
            "image",
            "author",
            "category",
            "category_id",
            "comments",
            "created_at",
            "updated_at",
        ]


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
