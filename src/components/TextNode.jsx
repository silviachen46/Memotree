import React from 'react';
import { Handle, Position } from 'reactflow';
import './TextNode.css'; // Create a CSS file for styling

const TextNode = ({ data }) => {
    return (
        <div className="text-node">
            <Handle type="target" position={Position.Top} />
            <div className="text-content">
                {data.text}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default TextNode; 