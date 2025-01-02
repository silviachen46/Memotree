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

  const handleConnect = useCallback((connection) => {
    setEdges((eds) => [...eds, connection]);
  }, [setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const addNode = (nodeType) => {
        const position = {
            x: Math.random() * 500,
            y: Math.random() * 500
        };
        
        const newNode = {
            id: `${nodeType}-${Date.now()}`,
            type: nodeType,
            data: { 
                initialText: '',
                onConnect: handleConnect
            },
            position: position,
        };
        
        // Include position in the node creation request
        if (nodeType === 'topicNode') {
            fetch('http://localhost:8000/api/chat/topic-node/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    node_id: newNode.id,
                    text: '',
                    x: position.x,
                    y: position.y
                }),
            });
        }
        
        setNodes((nds) => [...nds, newNode]);
    };

    setAddNodeFunction(() => addNode);
    
    // Set up clear nodes function
    setClearNodesFunction(() => () => {
      setNodes(initialNodes);
      setEdges([]);
    });
  }, [setAddNodeFunction, setClearNodesFunction, setNodes, handleConnect]);

  const fetchAllNodes = async () => {
    try {
      // Fetch topic nodes
      const topicResponse = await fetch('http://localhost:8000/api/chat/topic-nodes/');
      const linkResponse = await fetch('http://localhost:8000/api/chat/link-nodes/');
      
      if (!topicResponse.ok || !linkResponse.ok) {
        throw new Error('Failed to fetch nodes');
      }

      const topicData = await topicResponse.json();
      const linkData = await linkResponse.json();

      // Create topic nodes with stored positions
      const topicNodes = topicData.nodes.map((node) => ({
        id: node.node_id,
        data: { initialText: node.text },
        position: { x: node.x, y: node.y },  // Use stored position
        type: 'topicNode',
      }));

      // Create link nodes with stored positions
      const linkNodes = linkData.nodes.map((node) => ({
        id: node.node_id,
        type: 'linkNode',
        data: { 
          initialText: node.title,
          onConnect: handleConnect,
          linkData: { 
            author: node.author,
            title: node.title,
            publisher: node.publisher,
            description: node.description,
            date: node.date,
            tags: node.tags
          }
        },
        position: { x: node.x, y: node.y },  // Use stored position
      }));

      // Set all nodes
      setNodes([...initialNodes, ...topicNodes, ...linkNodes]);

      // Create edges for topic nodes to initial node
      const topicEdges = topicNodes.map((node) => ({
        id: `e${'initial-node'}-${node.id}`,
        source: 'initial-node',
        target: node.id,
        animated: false,
      }));

      // Create edges for link nodes to their parent topic nodes
      const linkEdges = linkData.nodes.map((node) => ({
        id: `e${node.parent_id}-${node.node_id}`,
        source: node.parent_id,
        target: node.node_id,
        animated: false,
      }));

      // Set all edges
      setEdges([...topicEdges, ...linkEdges]);

    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  useEffect(() => {
    fetchAllNodes();
  }, []);

  const handleNodesChange = useCallback((changes) => {
    changes.forEach(async (change) => {
      if (change.type === 'remove') {
        const removedNode = nodes.find(node => node.id === change.id);
        if (removedNode) {
          if (removedNode.type === 'topicNode') {
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
          } else if (removedNode.type === 'linkNode') {
            console.log(`Link node ${change.id} is removed`);
            try {
              const response = await fetch(`http://localhost:8000/api/chat/link-node/${change.id}/`, {
                method: 'DELETE'
              });
              if (!response.ok) {
                console.error('Failed to delete link node from database');
              }
            } catch (err) {
              console.error('Error deleting link node:', err);
            }
          }
        }
      }
    });
    onNodesChange(changes);
  }, [nodes, onNodesChange]);

  const handleNodeDragStop = useCallback(async (event, node) => {
    console.log(`Node ${node.id} moved to position:`, node.position);

    // Determine the correct endpoint based on node type
    const nodeTypePath = node.type === 'topicNode' ? 'topic-node' : 'link-node';

    try {
        const response = await fetch(`http://localhost:8000/api/chat/${nodeTypePath}/${node.id}/update-position/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: node.position.x,
                y: node.position.y
            }),
        });

        if (!response.ok) {
            console.error('Failed to update node position in database');
        }
    } catch (err) {
        console.error('Error updating node position:', err);
    }
  }, []);

  return (
    <div className="memo-container">
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={handleNodeDragStop}
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