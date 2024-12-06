from .serializers import (
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
from .models import Post
from rest_framework.permissions import IsAuthenticated


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

# post list view
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# post details view
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related("author")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "slug"  # Use slug instead of id
