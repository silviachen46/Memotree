from django.db import models

# Create your models here.

class ChatResponse(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    assistant_response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Chat Response for session {self.session_id}"

class TopicNode(models.Model):
    node_id = models.CharField(max_length=255, unique=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    board_id = models.IntegerField(default=1)
    board_name = models.CharField(max_length=255, default="default")
    node_level = models.IntegerField(default=1)

    def __str__(self):
        return f"Topic Node: {self.text[:50]}..."

    class Meta:
        ordering = ['-created_at']  # Orders by creation date, newest first

class LinkNode(models.Model):
    node_id = models.CharField(max_length=255, unique=True)
    author = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=255)
    publisher = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    date = models.CharField(max_length=255)  # Keep as CharField for flexibility
    tags = models.JSONField()  # Store tags as JSON array
    parent_id = models.CharField(max_length=255)  # Reference to parent TopicNode
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Link Node: {self.title[:50]}..."

    class Meta:
        ordering = ['-created_at']


