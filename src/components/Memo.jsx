import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Memo.css';

const initialNodes = [];
const initialEdges = [];

function Memo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [input, setInput] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddNode = () => {
    if (!input.trim()) return;

    const newNode = {
      id: `node-${nodes.length + 1}`,
      data: { label: input },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      type: 'default',
    };

    setNodes((nds) => [...nds, newNode]);
    setInput('');
  };

  return (
    <div className="memo-container">
      <div className="memo-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter node content..."
          className="memo-input"
        />
        <button onClick={handleAddNode} className="memo-add-button">
          Add Node
        </button>
      </div>
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Memo;
