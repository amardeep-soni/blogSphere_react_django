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
from django.db import models
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import permission_classes
from rest_framework import viewsets


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


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def update(self, request, *args, **kwargs):
        if request.user.username != kwargs.get('username'):
            raise PermissionDenied("You can only update your own profile")

        instance = self.get_object()

        # Update profile fields directly
        if 'bio' in request.data:
            instance.profile.bio = request.data['bio']
            instance.profile.save()

        if 'photo' in request.FILES:
            instance.profile.photo = request.FILES['photo']
            instance.profile.save()

        # Update user fields through serializer
        user_data = {}
        if 'first_name' in request.data:
            user_data['first_name'] = request.data['first_name']
        if 'last_name' in request.data:
            user_data['last_name'] = request.data['last_name']

        serializer = self.get_serializer(instance, data=user_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return updated data
        return Response(self.get_serializer(instance).data)


# Post List and Create View
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Post.objects.all()

    def perform_create(self, serializer):
        category = serializer.validated_data['category']
        user = self.request.user
        
        # Check if user has access to the category
        if not category.users.filter(id=user.id).exists():
            raise PermissionDenied("You don't have access to this category")
        
        serializer.save(author=user)


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
    serializer_class = CategorySerializer

    def get_permissions(self):
        """
        Override to allow public access for GET requests
        """
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        For POST form (creating blog): Return only user's categories
        For public viewing: Return all categories
        """
        # Check if the request is for blog form
        is_blog_form = self.request.query_params.get('for_blog_form') == 'true'
        
        if is_blog_form and self.request.user.is_authenticated:
            # Return only categories the user has access to
            return Category.objects.filter(users=self.request.user).distinct()
        
        # For public viewing, return all categories
        return Category.objects.all().order_by('name')

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').lower()
        existing_category = Category.objects.filter(name__iexact=name).first()
        
        if existing_category:
            # Add user to existing category's users if not already added
            if request.user not in existing_category.users.all():
                existing_category.users.add(request.user)
                return Response({
                    'id': existing_category.id,
                    'name': existing_category.name,
                    'message': 'Category already exists and has been added to your list'
                }, status=status.HTTP_200_OK)
            return Response({
                'id': existing_category.id,
                'name': existing_category.name,
                'message': 'You already have access to this category'
            }, status=status.HTTP_200_OK)
        
        # Create new category if it doesn't exist
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        category = serializer.save(
            created_by=self.request.user,
            name=serializer.validated_data['name'].lower()
        )
        category.users.add(self.request.user)


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
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Comment.objects.all().order_by("-created_at")
        
        # If user is authenticated, only return comments on their posts
        if self.request.user.is_authenticated:
            user_posts = Post.objects.filter(author=self.request.user)
            return queryset.filter(post__in=user_posts)
        
        # For unauthenticated users, return empty queryset
        return Comment.objects.none()

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        
        # Add total_user_comments if user is authenticated
        if request.user.is_authenticated:
            user_posts = Post.objects.filter(author=request.user)
            total_user_comments = Comment.objects.filter(post__in=user_posts).count()
            response.data = {
                'comments': response.data,
                'total_user_comments': total_user_comments
            }
        
        return response


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
                "excerpt": post.excerpt,
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


class UserPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the authenticated user
        posts = Post.objects.filter(author=user)  # Filter posts by the user
        serializer = PostSerializer(posts, many=True)  # Serialize the posts
        return Response(serializer.data)


class PostSearchView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get("q", "")
        if query:
            return Post.objects.filter(models.Q(title__icontains=query)).order_by(
                "-created_at"
            )
        return Post.objects.none()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        """
        Override to set different permissions for different actions:
        - List (GET): Allow anyone to view categories
        - Create/Update/Delete: Require authentication
        """
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Override to:
        - For POST/PUT/DELETE: Show only user's categories
        - For GET: Show all categories
        """
        if self.request.method == 'GET':
            return Category.objects.all()
        return Category.objects.filter(user=self.request.user)


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # Allow public access for viewing posts
    
    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at')
        category = self.request.query_params.get('category', None)
        
        if category:
            queryset = queryset.filter(category__name=category)
            
        return queryset
