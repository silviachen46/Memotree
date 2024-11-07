import React, { useState } from 'react';
import Chat from './components/Chat';
import Memo from './components/Memo';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [graphData, setGraphData] = useState(null);

  return (
    <div className="App">
      <Navbar />
      <div className="main-container">
        <div className="chat-section">
          <Chat setGraphData={setGraphData} />
        </div>
        <div className="memo-section">
          <Memo graphData={graphData} />
        </div>
      </div>
    </div>
  );
}

export default App;
