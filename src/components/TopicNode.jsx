import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';
import './TopicNode.css';

const TopicNode = memo(({ data }) => {
    const [text, setText] = useState(data?.initialText || '');
    const [isEditable, setIsEditable] = useState(true);

    const handleSave = () => {
        setIsEditable(false);
        if (data?.onSave) {
            data.onSave(text);
        }
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    return (
        <div className="topic-node">
            <Handle type="source" position={Position.Top} id="top" />
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
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