import React, { useState, useEffect } from 'react';
import API_BASE_URL from './config';
import './Search.css';

function Search() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('topic');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchNodes = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/api/chat/topic-nodes/?type=${searchType}&query=${encodeURIComponent(searchQuery)}`
            );
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

    const handleSearch = () => {
        fetchNodes();
    };

    const renderNode = (node) => {
        if (searchType === 'topic') {
            return (
                <div key={node.node_id} className="node-card">
                    <div className="node-content">
                        <p className="node-text">{node.text}</p>
                        <p className="node-date">
                            Last Edited: {new Date(node.last_edited).toLocaleDateString()}
                        </p>
                        <p className="node-board">
                            Board ID: {node.board_id}
                        </p>
                        <p className="node-board-name">
                            Board Name: {node.board_name}
                        </p>
                        <p className="node-position">
                            Position: (X: {node.x}, Y: {node.y})
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={node.node_id} className="node-card link-card">
                    <div className="node-content">
                        <h3 className="node-title">{node.title}</h3>
                        <p className="node-description">{node.description}</p>
                        <div className="node-tags">
                            {node.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}
                        </div>
                        <p className="node-date">
                            Last Edited: {new Date(node.last_edited).toLocaleDateString()}
                        </p>
                        <p className="node-position">
                            Position: (X: {node.x}, Y: {node.y})
                        </p>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="search-container">
            <div className="search-header">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="search-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-type-select"
                >
                    <option value="topic">Topic Nodes</option>
                    <option value="link">Link Nodes</option>
                </select>
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error-message">Error: {error}</div>}
            
            <div className="nodes-grid">
                {nodes.map(renderNode)}
            </div>
        </div>
    );
}

export default Search; 