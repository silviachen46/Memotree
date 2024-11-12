import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Memo from './components/Memo';
import MemoAlt from './components/MemoAlt';
import Login from './components/Login';
import Todo from './components/Todo';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';
import RightSidebar from './components/RightSidebar';
import { FaComments } from 'react-icons/fa';
import './App.css';

function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [useMemo, setUseMemo] = useState(true);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSetGraphData = (data) => {
    setGraphData(data);
  };

  const toggleMemoUsage = () => {
    setUseMemo(!useMemo);
  };

  return (
    <div className="main-container">
      <button 
        className={`chat-toggle-button ${isChatOpen ? 'open' : ''}`}
        onClick={toggleChat}
      >
        <FaComments />
      </button>
      
      <div className={`chat-sidebar ${isChatOpen ? 'open' : ''}`}>
        <Chat setGraphData={handleSetGraphData} />
      </div>
      
      <div className={`memo-section ${isChatOpen ? 'shifted' : ''}`}>
        {useMemo ? (
          <Memo graphData={graphData} clearGraphData={() => setGraphData(null)} />
        ) : (
          <MemoAlt />
        )}
      </div>
      
      <RightSidebar
        onAddLinkNode={() => console.log("Add Link Node")}
        onNewChat={() => console.log("New Chat")}
      />
      
      <div className="toggle-container">
        <label>
          Use Memo
          <input type="checkbox" checked={useMemo} onChange={toggleMemoUsage} />
        </label>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

export default App;
