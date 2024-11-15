import React, { useState, useEffect } from 'react';
import './RightSidebar.css';
import { nanoid } from 'nanoid';

function RightSidebar({ onNewChat, onAddLinkNode }) {
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
    if (onAddLinkNode) {
      const newNode = {
        id: nanoid(),
        type: 'linkNode',
        data: { 
          label: 'New Link',
          initialText: ''
        },
        position: { x: 100, y: 100 }
      };
      
      onAddLinkNode(newNode);
    } else {
      console.log("addNodeFunction is not set");
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  useEffect(() => {
    console.log("Received onAddLinkNode:", onAddLinkNode);
  }, [onAddLinkNode]);

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
          <button 
            className="new-chat-button" 
            onClick={handleNewChat}
          >
            + New Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar; 