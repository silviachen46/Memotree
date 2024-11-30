import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Memo.css';
import TextNode from './TextNode';

const initialNodes = [];
const initialEdges = [];

// Define node types
const nodeTypes = {
  textNode: TextNode,
};

function Memo({ graphData, clearGraphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (nodeData) => {
    setNodes((nds) => [...nds, nodeData]);
  };

  const addEdgeToGraph = (edgeData) => {
    const newEdge = {
      id: `${edgeData.source}-${edgeData.target}`,
      source: edgeData.source,
      target: edgeData.target,
      label: edgeData.type,
      type: 'smoothstep',
    };
    setEdges((eds) => [...eds, newEdge]);
  };

  // Process graphData when it changes
  useEffect(() => {
    if (graphData) {
      setNodes([]);
      setEdges([]);

      if (graphData.nodes.length === 0 && graphData.edges.length === 0) {
        return;
      }
      const { nodes: newNodes, edges: newEdges } = graphData;

      newNodes.forEach((node) => {
        addNode({
          id: node.id,
          data: { text: node.name },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          type: 'textNode',
        });
      });

      newEdges.forEach((edge) => {
        addEdgeToGraph(edge);
      });

      clearGraphData();
    }
  }, [graphData, clearGraphData]);

  return (
    <div className="memo-container">
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
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
