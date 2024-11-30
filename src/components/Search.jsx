import React, { useState, useEffect } from 'react';
import './Search.css';

function Search() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/chat/topic-nodes/');
            if (!response.ok) {
                throw new Error('Failed to fetch nodes');
            }
            const data = await response.json();
            setNodes(data.nodes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="search-container">Loading...</div>;
    if (error) return <div className="search-container">Error: {error}</div>;

    return (
        <div className="search-container">
            <h2>Topic Nodes</h2>
            <div className="nodes-grid">
                {nodes.map((node) => (
                    <div key={node.node_id} className="node-card">
                        <div className="node-content">
                            <p className="node-text">{node.text}</p>
                            <p className="node-date">
                                Created: {new Date(node.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search; 