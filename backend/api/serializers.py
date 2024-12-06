from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
from .models import Post


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

# post serializer
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "slug",
            "author",
            "created_at",
            "updated_at",
        ]
