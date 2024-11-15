import React, { useState } from 'react';
import './LinkNode.css';

function LinkNode({ initialText, onSave }) {
  const [text, setText] = useState(initialText);
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtractLink = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/chat/extract-link/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract link data');
      }

      const data = await response.json();
      setLinkData(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error extracting link:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-node">
      <div className="input-section">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL..."
        />
        <button 
          onClick={handleExtractLink}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Extract'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {linkData && (
        <div className="link-data">
          <h3>{linkData.title}</h3>
          <p><strong>Author:</strong> {linkData.author}</p>
          <p><strong>Publisher:</strong> {linkData.publisher}</p>
          <p><strong>Description:</strong> {linkData.description}</p>
          <p><strong>Date:</strong> {linkData.date}</p>
          <div className="tags">
            <strong>Tags:</strong>
            {linkData.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkNode; 