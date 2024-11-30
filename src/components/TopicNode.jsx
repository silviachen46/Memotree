import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';
import './TopicNode.css';

const TopicNode = memo(({ data, id }) => {
    const [text, setText] = useState(data?.initialText || '');
    const [isEditable, setIsEditable] = useState(!data?.initialText);

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/chat/topic-node/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    node_id: id,
                    text: text
                }),
            });

            if (response.ok) {
                setIsEditable(false);
                if (data?.onSave) {
                    data.onSave(text);
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to save topic node:', errorData.error);
            }
        } catch (err) {
            console.error('Error saving topic node:', err);
        }
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    return (
        <div className="topic-node">
            <Handle type="target" position={Position.Top} id="top" />
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="target" position={Position.Bottom} id="bottom" />
            <Handle type="source" position={Position.Left} id="left" />
            <div className="topic-content">
                <input 
                    type="text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    disabled={!isEditable}
                    placeholder="Enter topic..."
                    className="topic-input"
                />
                {isEditable ? (
                    <button onClick={handleSave} className="topic-button">Save</button>
                ) : (
                    <button onClick={handleEdit} className="topic-button">Edit</button>
                )}
            </div>
        </div>
    );
});

export default TopicNode; 