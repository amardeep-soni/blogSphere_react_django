from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
from .models import Category, Post, Comment


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        validated_data["email"] = validated_data["email"].lower().strip()
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        return user


# Login Serializer
class LoginTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login = attrs.get("username")  # Allow username or email in this field
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

        # Map username for parent serializer validation
        attrs["username"] = user.username

        return super().validate(attrs)


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


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


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )
    comments = CommentSerializer(
        many=True, read_only=True
    )  # Include all comments related to the post

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "slug",
            "author",
            "category",
            "category_id",
            "comments",
            "created_at",
            "updated_at",
        ]
