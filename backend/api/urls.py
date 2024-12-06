from django.urls import path
from .views import (
    CategoryDetailView,
    CategoryListCreateView,
    LoginTokenView,
    PostDetailView,
    PostListCreateView,
    RegisterView,
    UserListView,
    UserDetailView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginTokenView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    # Post URLs
    path("posts/", PostListCreateView.as_view(), name="post-list-create"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
    # Category URLs
    path("category/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("category/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
]
