import React, { useState, useEffect } from 'react';
import './Chat.css';
import API_BASE_URL from './config';

function Chat({ setGraphData, onNewChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': 'default',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      const newMessages = [...messages, userMessage, assistantMessage];

      setMessages(newMessages);
      localStorage.setItem('chatHistory', JSON.stringify(newMessages));

      // Extract JSON from the response content
      const jsonMatch = data.response.match(/\{.*\}/s);
      if (jsonMatch) {
        try {
          const parsedData = JSON.parse(jsonMatch[0]);
          if (parsedData.nodes && parsedData.edges) {
            setGraphData(parsedData); // Pass parsed nodes and edges to Memo
          }
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
      }

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Set the transcribed text as input
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleNewChat = () => {
    // Clear messages
    setMessages([]);
    // Clear graph data
    setGraphData({ nodes: [], edges: [] });
    // Clear local storage
    localStorage.removeItem('chatHistory');
    // Reset input
    setInput('');
    // Reset recording state if active
    if (isRecording) {
      setIsRecording(false);
    }
    // Call parent's onNewChat if provided
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            msg.role !== 'system' && (
              <div key={index} className={`message ${msg.role}`}>
                {msg.role === 'user' ? (
                  <span className="user-message">{msg.content}</span>
                ) : (
                  <span className="assistant-message">{msg.content}</span>
                )}
              </div>
            )
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={startRecording} disabled={isRecording}>
            {isRecording ? 'Recording...' : '🎤 Voice Input'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
