from django.urls import path
from .views import (
    CategoryDetailView,
    CategoryListCreateView,
    CommentDetailView,
    CommentListCreateView,
    LoginTokenView,
    PostDetailView,
    PostListCreateView,
    RecentPostListView,
    RegisterView,
    UserListView,
    UserDetailView,
    DashboardView,
    UserPostsView,
    PostSearchView,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginTokenView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # users URLs
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<str:username>/", UserDetailView.as_view(), name="user-detail"),
    path("user/posts/", UserPostsView.as_view(), name="user-posts"),
    # Post URLs
    path("posts/", PostListCreateView.as_view(), name="post-list-create"),
    path("posts/recent/", RecentPostListView.as_view(), name="recent-posts"),
    path("posts/search/", PostSearchView.as_view(), name="post-search"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
    # Category URLs
    path("category/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("category/<str:name>/", CategoryDetailView.as_view(), name="category-detail"),
    # Comment URLs
    path("comments/", CommentListCreateView.as_view(), name="comment-list-create"),
    path("comments/<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
    # Dashboard URLs
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]
