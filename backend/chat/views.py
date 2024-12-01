from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging
from groq import Groq
import os
from dotenv import load_dotenv
import json
from .services import GraphService
from .models import ChatResponse, TopicNode, LinkNode
import re
from .extract_link import extract_links, get_topic_sort
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer

logger = logging.getLogger(__name__)
load_dotenv()

# Store conversation histories in memory (consider using Redis or database for production)
conversations = {}

@api_view(['POST'])
def chat(request):
    print("Received request method:", request.method)
    print("Received headers:", request.headers)
    print("Received data:", request.data)
    
    try:
        # Verify API key exists
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            logger.error("GROQ_API_KEY not found in environment variables")
            print("API key missing")
            return Response({"error": "API key not configured"}, status=500)

        groq_client = Groq(api_key=api_key)
        
        # Get user message and session ID
        user_message = request.data.get('message')
        session_id = request.headers.get('X-Session-ID', 'default')  # Use headers for session ID
        
        if not user_message:
            print("No message provided")
            return Response({"error": "No message provided"}, status=400)

        # Initialize conversation history for new sessions only
        if session_id not in conversations:
            conversations[session_id] = []  # Initialize for new session

        # Define prompt and add it only if the conversation is new
        if len(conversations[session_id]) == 0:
            prompt = """With the given input, reformat it into a JSON with hierarchical structure of the content. 
            You should also update the newly provided info into the previously returned JSON.
            The Data could be anything like a list of items, a single item, a paragraph, etc.
            You should solely return the JSON and nothing else.
            If a rough time is mentioned, you can estimate the time and set a default timeframe for it. For example, do laundry might take 2hrs morning => 9am to 11am by default.
            
            You can reference to this format:
            {
                "nodes": [{"id": "node1", "name": "node1", "type": "node_type", "attributes": {"attribute1": "value1", "attribute2": "value2"}}, {"id": "node2", "name": "node2", "type": "node_type", "attributes": {"attribute1": "value1", "attribute2": "value2"}}],
                "edges": [{"source": "node1", "target": "node2", "type": "edge_type"}]
            }
            If a JSON already exists in past conversation, you should look at the existing content and add new nodes and edges based on the relation you understood.
            You should return JSON only and nothing else. You shouldn't add any other text before or after the JSON.
            """
            conversations[session_id].append({
                "role": "system",
                "content": prompt
            })

        # Add user message to conversation history
        conversations[session_id].append({
            "role": "user",
            "content": user_message
        })
        
        # Get conversation history (limited to last 10 messages to manage context length)
        messages = conversations[session_id][-10:]
        
        try:
            print("Making Groq API call with history:", messages)
            completion = groq_client.chat.completions.create(
                messages=messages,
                model="llama-3.1-70b-versatile",
                temperature=0.7,
                max_tokens=1024,
            )
            
            assistant_response = completion.choices[0].message.content
            print("Got response:", assistant_response)
            try:
                json_response = json.loads(assistant_response)
                # Generate graph data
                graph_data = GraphService.parse_json_to_graph_data(json_response)
                ChatResponse.objects.update_or_create(
                        session_id=session_id,
                        defaults={'assistant_response': json_response}
                )
            except json.JSONDecodeError:
                logger.error("Failed to parse JSON response")
                graph_data = {"nodes": [], "edges": []}
            
            # Add assistant response to conversation history
            conversations[session_id].append({
                "role": "assistant",
                "content": assistant_response
            })
            
            # Return both the response and the graph data
            return Response({
                "response": assistant_response,
                "history": conversations[session_id],
                "graph_data": graph_data
            })
            
        except Exception as groq_error:
            print("Groq API error:", str(groq_error))
            logger.error(f"Groq API error: {str(groq_error)}")
            return Response(
                {"error": f"Failed to get response from Groq API: {str(groq_error)}"}, 
                status=500
            )
    
    except Exception as e:
        print("Unexpected error:", str(e))
        logger.error(f"Unexpected error: {str(e)}")
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

# Optionally, add an endpoint to get chat history
@api_view(['GET'])
def get_chat_history(request):
    session_id = request.headers.get('X-Session-ID', 'default')
    history = conversations.get(session_id, [])
    return Response({"history": history})

@api_view(['POST'])
def extract_link(request):
    try:
        # Get node_id from request data
        node_id = request.data.get('node_id')
        if not node_id:
            return Response({'error': 'node_id is required'}, status=400)

        # Find all TopicNodes with board_id 1 and node_level 1
        topic_nodes = TopicNode.objects.filter(board_id=1, node_level=1)
        
        # Extract the text from the topic nodes
        topic_texts = [node.text for node in topic_nodes]
        
        link = request.data.get('text')
        
        if not link:
            return Response({'links': [], 'data': []})
            
        # Extract metadata for each link
        data_dict = extract_links(link)
        tag_assigned = get_topic_sort(data_dict['description'] + data_dict['title'], topic_texts)
        logger.debug(f'Tag assigned: {tag_assigned}')
        parent_id = TopicNode.objects.filter(board_id=1, node_level=1, text=tag_assigned).first().node_id
        data_dict['parent_id'] = parent_id
        
        # Create LinkNode in database
        try:
            link_node = LinkNode.objects.create(
                node_id=node_id,  # Use the node_id from request
                author=data_dict['author'],
                title=data_dict['title'],
                publisher=data_dict['publisher'],
                description=data_dict['description'],
                date=data_dict['date'],
                tags=data_dict['tags'],
                parent_id=data_dict['parent_id']
            )
            logger.info(f'Created LinkNode with id: {link_node.node_id}')
        except Exception as e:
            logger.error(f'Error creating LinkNode: {str(e)}')
            raise
        
        return Response({
            'data': data_dict
        })
        
    except Exception as e:
        logger.error(f"Error in extract_link: {str(e)}")
        return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@api_view(['DELETE'])
def delete_link_node(request, node_id):
    try:
        link_node = LinkNode.objects.get(node_id=node_id)
        link_node.delete()
        return Response({
            'message': 'Link node deleted successfully'
        }, status=status.HTTP_200_OK)
    except LinkNode.DoesNotExist:
        return Response({
            'error': 'Link node not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_link_nodes(request):
    nodes = LinkNode.objects.all()
    return Response({
        'nodes': [{
            'node_id': node.node_id,
            'author': node.author,
            'title': node.title,
            'publisher': node.publisher,
            'description': node.description,
            'date': node.date,
            'tags': node.tags,
            'parent_id': node.parent_id
        } for node in nodes]
    })

@api_view(['POST'])
def extract_link_test(request):
    topic_nodes = TopicNode.objects.filter(board_id=1, node_level=1)
    if topic_nodes:
        topic_texts = [node.text for node in topic_nodes]
    # Extract the text from the topic nodes
    else:
        topic_texts = ""
    logger.debug(f'Topic texts: {topic_texts}')  # Log at DEBUG level
    # Sample test data mimicking the structure of data_dict
    data_dict = {
        'author': 'John Doe',
        'title': 'Sample Article Title',
        'publisher': 'Sample Publisher',
        'description': 'This is a sample description of the article.',
        'date': '2023-10-01',
        'tags': ['sample', 'test', 'article'],
        'test': topic_texts
    }
    
    return Response({
        'data': data_dict
    })
        


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_topic_node(request):
    try:
        node_id = request.data.get('node_id')
        text = request.data.get('text')
        
        topic_node = TopicNode.objects.create(
            node_id=node_id,
            text=text,
            board_id=1,  # Set default board_id
            board_name="default",  # Set default board_name
            node_level=1  # Set default node_level
        )
        
        return Response({
            'message': 'Topic node created successfully',
            'node_id': topic_node.node_id
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_topic_node(request, node_id):
    try:
        topic_node = TopicNode.objects.get(node_id=node_id)
        topic_node.delete()
        return Response({
            'message': 'Topic node deleted successfully'
        }, status=status.HTTP_200_OK)
    except TopicNode.DoesNotExist:
        return Response({
            'error': 'Topic node not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def search_topic_nodes(request):
    search_type = request.GET.get('type', 'topic')  # 'topic' or 'link'
    search_query = request.GET.get('query', '')

    if search_type == 'topic':
        # Search in TopicNode
        nodes = TopicNode.objects.filter(text__icontains=search_query).order_by('-updated_at')
        return Response({
            'nodes': [{
                'node_id': node.node_id,
                'text': node.text,
                'last_edited': node.updated_at,
                'board_id': node.board_id,
                'board_name': node.board_name
            } for node in nodes]
        })
    else:
        # Search in LinkNode
        nodes = LinkNode.objects.filter(
            title__icontains=search_query
        ).order_by('-updated_at')
        return Response({
            'nodes': [{
                'node_id': node.node_id,
                'title': node.title,
                'description': node.description,
                'tags': node.tags,
                'last_edited': node.updated_at
            } for node in nodes]
        })

@api_view(['PUT'])
def update_topic_node(request, node_id):
    try:
        topic_node = TopicNode.objects.get(node_id=node_id)
        text = request.data.get('text')
        
        topic_node.text = text
        topic_node.save()
        
        return Response({
            'message': 'Topic node updated successfully',
            'node_id': topic_node.node_id,
            'text': topic_node.text
        }, status=status.HTTP_200_OK)
    except TopicNode.DoesNotExist:
        return Response({
            'error': 'Topic node not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_link_node(request):
    try:
        node_id = request.data.get('node_id')
        author = request.data.get('author')
        title = request.data.get('title')
        publisher = request.data.get('publisher')
        description = request.data.get('description')
        date = request.data.get('date')
        tags = request.data.get('tags')
        parent_id = request.data.get('parent_id')
        
        link_node = LinkNode.objects.create(
            node_id=node_id,
            author=author,
            title=title,
            publisher=publisher,
            description=description,
            date=date,
            tags=tags,
            parent_id=parent_id
        )
        
        return Response({
            'message': 'Link node created successfully',
            'node_id': link_node.node_id,
            'data': {
                'author': link_node.author,
                'title': link_node.title,
                'publisher': link_node.publisher,
                'description': link_node.description,
                'date': link_node.date,
                'tags': link_node.tags,
                'parent_id': link_node.parent_id
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)