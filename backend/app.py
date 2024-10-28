from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Store conversation histories for different sessions
# In a production environment, you'd want to use a proper database
conversations = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        session_id = request.headers.get('X-Session-ID', 'default')  # You can implement proper session handling
        
        # Initialize conversation history if it doesn't exist
        if session_id not in conversations:
            conversations[session_id] = []
        
        # Add user message to conversation history
        conversations[session_id].append({
            "role": "user",
            "content": user_message
        })
        
        # Create messages array with all previous context
        messages = conversations[session_id].copy()
        
        # Make API call with full conversation history
        completion = groq_client.chat.completions.create(
            messages=messages,
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=1024,
        )
        
        # Get the response
        assistant_response = completion.choices[0].message.content
        
        # Add assistant's response to conversation history
        conversations[session_id].append({
            "role": "assistant",
            "content": assistant_response
        })
        
        # Limit conversation history to last 10 messages to prevent token limit issues
        if len(conversations[session_id]) > 10:
            conversations[session_id] = conversations[session_id][-10:]
        
        return jsonify({"response": assistant_response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
