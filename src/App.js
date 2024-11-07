import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Memo from './components/Memo';
import Login from './components/Login';
import Navbar from './components/Navbar';
import './App.css';

// Create a MainLayout component for the chat and memo interface
function MainLayout() {
  const [graphData, setGraphData] = useState(null);
  
  return (
    <div className="main-container">
      <div className="chat-section">
        <Chat setGraphData={setGraphData} />
      </div>
      <div className="memo-section">
        <Memo graphData={graphData} />
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
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

export default App;
