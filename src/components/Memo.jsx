import React, { useState, useCallback, useEffect } from 'react';
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

function Memo({ graphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes when graphData changes
  useEffect(() => {
    if (graphData) {
      const newNode = {
        id: `node-${nodes.length + 1}`,
        data: { label: graphData },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        type: 'default',
      };
      setNodes((nds) => [...nds, newNode]);
    }
  }, [graphData]);

  return (
    <div className="memo-container">
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
