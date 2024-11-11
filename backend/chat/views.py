from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging
from groq import Groq
import os
from dotenv import load_dotenv
import json
from .services import GraphService
from .models import ChatResponse

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
