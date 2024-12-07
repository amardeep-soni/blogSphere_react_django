from django.forms import ValidationError
from .serializers import (
    CategorySerializer,
    CommentSerializer,
    PostSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginTokenSerializer,
)
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Category, Post, Comment
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.permissions import AllowAny


# User Detail View
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# Register View
class RegisterView(APIView):
    permission_classes = []  # Allow unauthenticated users

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login View
class LoginTokenView(TokenObtainPairView):
    serializer_class = LoginTokenSerializer


# User Views
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# Post List and Create View
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # Allow anyone to view posts, but only authenticated users can create posts
    permission_classes = [AllowAny]  # Public view for listing posts

    def perform_create(self, serializer):
        # Only authenticated users can create posts
        if not self.request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to create a post.")
        serializer.save(author=self.request.user)


# Post Detail View
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related("author")
    serializer_class = PostSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]  # Anyone can view posts

    # Restrict update and delete permissions to the post author
    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            self.permission_classes = [
                IsPostAuthor
            ]  # Only the author can update or delete
        else:
            self.permission_classes = [AllowAny]  # Anyone can view
        return super().get_permissions()

    def perform_update(self, serializer):
        # Ensure only the post author can update their post
        if self.get_object().author != self.request.user:
            raise PermissionDenied("You do not have permission to edit this post.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure only the post author can delete their post
        if instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to delete this post.")
        instance.delete()


# Custom Permission for Post Author Only
class IsPostAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


# Comment Views
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.select_related("post")
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]  # Allow anyone to submit comments

    def perform_create(self, serializer):
        # Get the slug from the request data
        slug = self.request.data.get("slug")
        if not slug:
            raise ValidationError({"slug": "This field is required."})

        # Retrieve the post using the slug
        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            raise NotFound("Post with the given slug does not exist.")

        # Save the comment with the associated post
        serializer.save(post=post)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.select_related("post")
    serializer_class = CommentSerializer
    permission_classes = [
        AllowAny
    ]
