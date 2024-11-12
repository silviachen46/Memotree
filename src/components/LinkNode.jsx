import React, { useState } from 'react';
import './LinkNode.css'; // Add styles for the LinkNode

function LinkNode({ initialText, onSave }) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  return (
    <div className="link-node">
      {isEditing ? (
        <>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span>{text}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
}

export default LinkNode; 