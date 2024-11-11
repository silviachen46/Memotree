import React, { useState } from 'react';
import './RightSidebar.css';

function RightSidebar({ onNewChat }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`right-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div 
        className="collapse-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '◀' : '▶'}
      </div>
      <div className="sidebar-content">
        {/* Other content can go here if needed */}
      </div>
      <div className="new-chat-container">
        <button className="new-chat-button" onClick={onNewChat}>
          + New Chat
        </button>
      </div>
    </div>
  );
}

export default RightSidebar; 