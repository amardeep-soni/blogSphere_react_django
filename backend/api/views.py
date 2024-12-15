from django.forms import ValidationError
from .serializers import (
    CategorySerializer,
    CategoryDetailSerializer,
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
from django.http import JsonResponse


# Register View
class RegisterView(APIView):
    permission_classes = []  # Allow unauthenticated users

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},  # Success message only
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


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"  # Fetch user details via username

    # Allow unauthenticated users to view the user details
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny]  # Allow anyone to view user details
        else:
            self.permission_classes = [
                IsAuthenticated
            ]  # Require authentication for other actions
        return super().get_permissions()


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


# Recent Blog Posts View
class RecentPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # Public access to recent posts

    def get_queryset(self):
        return Post.objects.order_by("-created_at")[:6]  # Get 6 most recent posts


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


# Category List and Create View
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == "GET":  # Allow unauthenticated GET requests
            return [AllowAny()]
        return [IsAuthenticated()]  # Require authentication for POST


# Category Detail, Update, and Delete View
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryDetailSerializer
    lookup_field = "name"

    def get_permissions(self):
        if self.request.method == "GET":  # Allow unauthenticated GET requests
            return [AllowAny()]
        return [IsAuthenticated()]  # Require authentication for PUT, PATCH, DELETE


# Comment Views
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.select_related("post")
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]  # Allow anyone to submit comments

    def get_queryset(self):
        # Fetch comments ordered by latest created_at first
        return Comment.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        # Extract slug from request data and associate the post
        slug = self.request.data.get("slug")
        if not slug:
            raise ValidationError({"slug": "This field is required."})

        try:
            post = Post.objects.get(slug=slug)
        except Post.DoesNotExist:
            raise NotFound("Post with the given slug does not exist.")

        # Save the comment
        serializer.save(post=post)

    def create(self, request, *args, **kwargs):
        """
        Override the create method to return the newly created comment,
        including the user_image field.
        """
        response = super().create(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_201_CREATED)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.select_related("post")
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]


class DashboardView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Total posts created by the user
        posts = Post.objects.filter(author=user)
        total_posts = posts.count()

        # Total comments for all posts created by the user
        total_comments = Comment.objects.filter(post__in=posts).count()

        # Latest 4 posts
        recent_posts = posts.order_by("-created_at")[:4]

        # Recent 4 comments for all posts created by the user
        recent_comments = Comment.objects.filter(post__in=posts).order_by(
            "-created_at"
        )[:4]

        # Prepare recent posts with their individual comment count
        posts_data = [
            {
                "title": post.title,
                "created_at": post.created_at,
                "content": post.content,
                "comments_count": post.comments.count(),
                "slug": post.slug,
            }
            for post in recent_posts
        ]

        # Prepare recent comments data
        comments_data = [
            {
                "content": comment.content,
                "post": comment.post.title,
                "created_at": comment.created_at,
                "name": comment.name,
                "slug": comment.post.slug,
            }
            for comment in recent_comments
        ]

        # Response data
        response = {
            "totalPosts": total_posts,
            "totalComments": total_comments,
            "recentPosts": posts_data,
            "recentComments": comments_data,
        }

        return JsonResponse(response, safe=False)
