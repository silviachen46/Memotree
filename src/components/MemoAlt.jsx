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
  topicNode: TopicNode,
};

function MemoAlt({ setAddNodeFunction, setClearNodesFunction }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const addNode = (nodeType) => {
      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        data: { initialText: '' },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
      };
      setNodes((nds) => [...nds, newNode]);
    };

    setAddNodeFunction(() => addNode);
    
    // Set up clear nodes function
    setClearNodesFunction(() => () => {
      setNodes(initialNodes);
      setEdges([]);
    });
  }, [setAddNodeFunction, setClearNodesFunction, setNodes]);

  const fetchTopicNodes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/chat/topic-nodes/');
      if (!response.ok) {
        throw new Error('Failed to fetch topic nodes');
      }
      const data = await response.json();
      const topicNodes = data.nodes;

      const newNodes = topicNodes.map((node) => ({
        id: node.node_id,
        data: { initialText: node.text },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        type: 'topicNode',
      }));

      setNodes((nds) => [...nds, ...newNodes]);

      const newEdges = newNodes.map((node) => ({
        id: `e${'initial-node'}-${node.id}`,
        source: 'initial-node',
        target: node.id,
        animated: false,
      }));

      setEdges((eds) => [...eds, ...newEdges]);
    } catch (error) {
      console.error('Error fetching topic nodes:', error);
    }
  };

  useEffect(() => {
    fetchTopicNodes();
  }, []);

  const handleNodesChange = useCallback((changes) => {
    changes.forEach(async (change) => {
      if (change.type === 'remove') {
        const removedNode = nodes.find(node => node.id === change.id);
        if (removedNode && removedNode.type === 'topicNode') {
          console.log(`Topic node ${change.id} is removed`);
          try {
            const response = await fetch(`http://localhost:8000/api/chat/topic-node/${change.id}/`, {
              method: 'DELETE'
            });
            if (!response.ok) {
              console.error('Failed to delete topic node from database');
            }
          } catch (err) {
            console.error('Error deleting topic node:', err);
          }
        }
      }
    });
    onNodesChange(changes);
  }, [nodes, onNodesChange]);

  return (
    <div className="memo-container">
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
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