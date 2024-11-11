import React, { useState } from 'react';
import './RightSidebar.css';

function RightSidebar({ onNewChat, onResetGraph }) {
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
        <div className="new-chat-container">
          <button className="new-chat-button" onClick={onNewChat}>
            + New Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar; 