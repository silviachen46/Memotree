from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat, name='chat'),
    path('extract-link/', views.extract_link, name='extract_link'),
    path('extract-link-test/', views.extract_link_test, name='extract_link_test'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
] 