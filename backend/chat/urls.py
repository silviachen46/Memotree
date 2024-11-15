from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat, name='chat'),
    path('extract-link/', views.extract_link, name='extract_link'),
] 