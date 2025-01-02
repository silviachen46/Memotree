import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './LinkNode.css';

function LinkNode({ data, id }) {
  const [text, setText] = useState(data?.initialText || '');
  const [linkData, setLinkData] = useState(data?.linkData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleExtractLink = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/chat/extract-link/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: text,
          node_id: id,
          x: data.position?.x || Math.random() * 500,
          y: data.position?.y || Math.random() * 500
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract link data');
      }

      const responseData = await response.json();
      setLinkData(responseData.data);

      if (responseData.data.parent_id && data.onConnect) {
        const connection = {
          source: responseData.data.parent_id,
          target: id,
          id: `e${responseData.data.parent_id}-${id}`,
        };
        data.onConnect(connection);
      }

    } catch (err) {
      setError(err.message);
      console.error('Error extracting link:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = () => {
    setIsNotesSaved(true);
    setIsEditing(false);
    if (data?.onSave) {
      data.onSave(notes);
    }
  };

  const handleEditNotes = () => {
    setIsEditing(true);
    setIsNotesSaved(false);
  };

  return (
    <div className="link-node">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />

      {linkData ? (
        <div className="link-data">
          <div className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? '▼' : '▲'}
          </div>
          {!isCollapsed ? (
            <>
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
              <div className="expand-icon" onClick={() => setShowNotes(!showNotes)}>
                {showNotes ? '▲' : '▼'}
              </div>
              {showNotes && (
                <div className="notes-section">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter your notes here..."
                    disabled={isNotesSaved && !isEditing}
                  />
                  <button onClick={isNotesSaved ? handleEditNotes : handleSaveNotes}>
                    {isNotesSaved ? 'Edit' : 'Save'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <h3>{linkData.title}</h3>
          )}
        </div>
      ) : (
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
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default LinkNode; 