import React, { useState } from 'react';
import './RightSidebar.css';

function RightSidebar({ onNewChat, onResetGraph }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropupOpen, setIsDropupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('link');

  const options = [
    { value: 'link', label: 'Link Node' }
  ];

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setIsDropupOpen(false);
  };

  const handleAddNode = () => {
    // TODO: Implement add node functionality based on selectedOption
    console.log(`Adding node with type: ${selectedOption}`);
  };

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
          <div className="dropup-container">
            <div className={`dropup-menu ${isDropupOpen ? 'show' : ''}`}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className="dropup-item"
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
            <button 
              className="dropup-toggle"
              onClick={() => setIsDropupOpen(!isDropupOpen)}
            >
              {options.find(opt => opt.value === selectedOption)?.label || 'Select Type'} ▼
            </button>
            <button 
              className="add-node-button"
              onClick={handleAddNode}
            >
              Add Node
            </button>
          </div>
          <button className="new-chat-button" onClick={onNewChat}>
            + New Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar; 