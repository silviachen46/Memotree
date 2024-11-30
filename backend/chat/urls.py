from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat, name='chat'),
    path('extract-link/', views.extract_link, name='extract_link'),
    path('extract-link-test/', views.extract_link_test, name='extract_link_test'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('topic-node/', views.create_topic_node, name='create_topic_node'),
    path('topic-node/<str:node_id>/', views.delete_topic_node, name='delete_topic_node'),
    path('topic-nodes/', views.search_topic_nodes, name='search_topic_nodes'),
] 