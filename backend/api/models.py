from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


# User Profile Model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, null=True)  # User bio
    photo = models.ImageField(
        upload_to="profile_photos/", blank=True, null=True
    )  # Profile photo

    def __str__(self):
        return f"{self.user.username}'s Profile"


# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.CharField(max_length=255)
    content = models.TextField()
    slug = models.SlugField(unique=True, max_length=255, blank=True)  # Add slug field
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    category = models.ForeignKey(
        "Category", on_delete=models.CASCADE, related_name="posts"
    )
    image = models.ImageField(upload_to="post_images/", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Check if this is an existing instance
        if self.pk:
            original = Post.objects.get(pk=self.pk)
            # Update the slug only if the title has changed
            if original.title != self.title:
                base_slug = slugify(self.title)
                slug = base_slug
                counter = 1
                while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                self.slug = slug
        else:
            # For new instances, generate a slug
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='categories')
    users = models.ManyToManyField(User, related_name='accessible_categories')

    def __str__(self):
        return self.name


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    name = models.CharField(max_length=100)  # Name of the commenter
    email = models.EmailField()  # Email of the commenter
    content = models.TextField()  # Message content
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.name} on {self.post.title}"
