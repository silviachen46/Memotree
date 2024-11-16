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
import LinkNode from './LinkNode';
import TopicNode from './TopicNode';
const initialNodes = [
  {
    id: 'initial-node',
    data: { label: 'Initial Node' },
    position: { x: 250, y: 250 }, // Center position
    type: 'default',
  },
];

const initialEdges = [];
const nodeTypes = {
  linkNode: LinkNode,
  topicNode: TopicNode  // Add TopicNode to nodeTypes
};
function MemoAlt({ setAddNodeFunction, setClearNodesFunction }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);

      // Log message if connecting LinkNode and TopicNode
      if (sourceNode && targetNode) {
        if (
          (sourceNode.type === 'linkNode' && targetNode.type === 'topicNode') ||
          (sourceNode.type === 'topicNode' && targetNode.type === 'linkNode')
        ) {
          console.log("An edge between LinkNode and TopicNode is connected");
        }
      }
      console.log('Edge connected:', params); // Log connection details
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setEdges]
  );

  // const addNode = useCallback(() => {
  //   console.log("Adding node");
  //   const newNode = {
  //     id: `node-${Date.now()}`,
  //     data: { label: 'New Node' },
  //     position: { x: Math.random() * 500, y: Math.random() * 500 },
  //     type: 'default',
  //   };
  //   setNodes((nds) => [...nds, newNode]);
  // }, [setNodes]);

  const addNode = useCallback((type = 'linkNode') => {
    console.log(`Adding ${type}`);
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: type,
      data: { 
        initialText: '',
        onSave: (text) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === newNode.id
                ? { ...node, data: { ...node.data, initialText: text } }
                : node
            )
          );
        }
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const clearNodes = useCallback(() => {
    setNodes([initialNodes[0]]); // Reset to only the initial node
    setEdges([]); // Clear all edges
  }, [setNodes, setEdges]);

  useEffect(() => {
    console.log("MemoAlt rendered");
    if (setAddNodeFunction) {
      console.log("Setting addNodeFunction");
      setAddNodeFunction(() => addNode);
      return () => setAddNodeFunction(null);
    }
  }, [setAddNodeFunction, addNode]);

  useEffect(() => {
    if (setClearNodesFunction) {
      setClearNodesFunction(() => clearNodes);
      return () => setClearNodesFunction(null);
    }
  }, [setClearNodesFunction, clearNodes]);

  return (
    <div className="memo-container">
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
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

export default MemoAlt; 