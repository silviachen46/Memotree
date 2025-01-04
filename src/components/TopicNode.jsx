import React, { useState, memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import './TopicNode.css';
import API_BASE_URL from './config';

const TopicNode = memo(({ data, id }) => {
    const [text, setText] = useState(data?.initialText || '');
    const [isEditable, setIsEditable] = useState(!data?.initialText);
    const { getEdges, getNode, setNodes } = useReactFlow();
    const [areNodesHidden, setAreNodesHidden] = useState(false); // State to track visibility

    const handleCollapse = () => {
        const edges = getEdges();
        
        // Find all connected edges for the current topic node
        const connectedEdges = edges.filter(edge => 
            edge.source === id || edge.target === id
        );

        // Get the IDs of connected nodes
        const connectedNodeIds = connectedEdges.map(edge => {
            return edge.source === id ? edge.target : edge.source;
        });

        // Filter for link nodes that start with "linkNode"
        const linkNodeIds = connectedNodeIds.filter(nodeId => {
            const node = getNode(nodeId);
            return node && node.type === 'linkNode' && nodeId.startsWith("linkNode");
        });

        // Toggle visibility
        setNodes((nds) => 
            nds.map(node => {
                if (linkNodeIds.includes(node.id)) {
                    return { ...node, hidden: !areNodesHidden }; // Toggle hidden state
                }
                return node;
            })
        );

        // Update the visibility state
        setAreNodesHidden(prev => !prev);

        console.log('Connected link node IDs toggled:', linkNodeIds);
    };

    const handleSave = async () => {
        try {
            const url = data?.initialText 
                ? `${API_BASE_URL}/api/chat/topic-node/${id}/update/`
                : `${API_BASE_URL}/api/chat/topic-node/`;
                
            const method = data?.initialText ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
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
                console.error(`Failed to ${method === 'PUT' ? 'update' : 'save'} topic node:`, errorData.error);
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
            <Handle type="target" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
            <Handle type="source" position={Position.Left} id="left" />
            <div className="topic-content">
                <button 
                    onClick={handleCollapse} 
                    className="collapse-button"
                >
                    {areNodesHidden ? '🔼' : '🔍'} {/* Change icon based on state */}
                </button>
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