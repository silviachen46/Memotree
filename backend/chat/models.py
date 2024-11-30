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

    def __str__(self):
        return f"Topic Node: {self.text[:50]}..."

    class Meta:
        ordering = ['-created_at']  # Orders by creation date, newest first


