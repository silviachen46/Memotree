// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Chat from './components/Chat';
// import Memo from './components/Memo';
// import Login from './components/Login';
// import Todo from './components/Todo';
// import Navbar from './components/Navbar';
// import { FaComments } from 'react-icons/fa';
// import './App.css';

// function MainLayout() {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [graphData, setGraphData] = useState(null); // State to store AI response for nodes

//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   const handleSetGraphData = (data) => {
//     setGraphData(data); // Update graphData with AI response
//   };

//   return (
//     <div className="main-container">
//       <button 
//         className={`chat-toggle-button ${isChatOpen ? 'open' : ''}`}
//         onClick={toggleChat}
//       >
//         <FaComments />
//       </button>
      
//       <div className={`chat-sidebar ${isChatOpen ? 'open' : ''}`}>
//         <Chat setGraphData={handleSetGraphData} /> {/* Pass setGraphData to Chat */}
//       </div>
      
//       <div className={`memo-section ${isChatOpen ? 'shifted' : ''}`}>
//         <Memo graphData={graphData} clearGraphData={() => setGraphData(null)} /> {/* Pass graphData to Memo */}
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/todo" element={<Todo />} />
//         <Route path="/" element={<MainLayout />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Memo from './components/Memo';
import Login from './components/Login';
import Todo from './components/Todo';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar'; // Import the Calendar component
import { FaComments } from 'react-icons/fa';
import './App.css';

function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [graphData, setGraphData] = useState(null); // State to store AI response for nodes

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSetGraphData = (data) => {
    setGraphData(data); // Update graphData with AI response
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
        <Chat setGraphData={handleSetGraphData} /> {/* Pass setGraphData to Chat */}
      </div>
      
      <div className={`memo-section ${isChatOpen ? 'shifted' : ''}`}>
        <Memo graphData={graphData} clearGraphData={() => setGraphData(null)} /> {/* Pass graphData to Memo */}
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
        <Route path="/calendar" element={<Calendar />} /> {/* New route for Calendar */}
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

export default App;
