// import React, { useState, useEffect } from 'react';
// import './Chat.css';

// function Chat({ setGraphData }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   // Clear messages and local storage on component mount
//   useEffect(() => {
//     setMessages([]);
//     localStorage.removeItem('chatHistory'); // Clear local storage
//   }, []);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', content: input };

//     try {
//       const response = await fetch('http://localhost:8000/api/chat/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Session-ID': 'default',
//           'Accept': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ message: input })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Append new user and assistant messages to the current history
//       const assistantMessage = { role: 'assistant', content: data.response };
//       const newMessages = [...messages, userMessage, assistantMessage];

//       setMessages(newMessages);
//       localStorage.setItem('chatHistory', JSON.stringify(newMessages));
//       setGraphData(input); 
//       setInput('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           msg.role !== 'system' && (
//             <div key={index} className={`message ${msg.role}`}>
//               {msg.role === 'user' ? (
//                 <span className="user-message">{msg.content}</span>
//               ) : (
//                 <span className="assistant-message">{msg.content}</span>
//               )}
//             </div>
//           )
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default Chat;
import React, { useState, useEffect } from 'react';
import './Chat.css';

function Chat({ setGraphData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
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

      setGraphData(data.response); // Pass AI response to Memo as graphData
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
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
      </div>
    </div>
  );
}

export default Chat;
