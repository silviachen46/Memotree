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
import LinkNode from './LinkNode';
const initialNodes = [];
const initialEdges = [];

// Define node types
const nodeTypes = {
  linkNode: LinkNode
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
      label: edgeData.type, // Label the edge with the relationship type
      type: 'smoothstep', // Makes the edges look curved and flow better
    };
    setEdges((eds) => [...eds, newEdge]);
  };

  // Process graphData when it changes
  useEffect(() => {
    if (graphData) {
      setNodes([]);
      setEdges([]);

      // If the graph data is empty (after reset), we're done
      if (graphData.nodes.length === 0 && graphData.edges.length === 0) {
        return;
      }
      const { nodes: newNodes, edges: newEdges } = graphData;

      // Position nodes based on their relationships to prevent overlap and create a flow
      const positionMap = {}; // To store assigned positions for nodes
      let xPosition = 50; // Initial x position
      let yPosition = 50; // Initial y position
      const spacing = 200; // Space between nodes

      newNodes.forEach((node) => {
        // Position nodes based on existing nodes
        const position = positionMap[node.id] || { x: xPosition, y: yPosition };
        positionMap[node.id] = position;
        addNode(node);

        // Update positioning for the next node
        xPosition += spacing;
        if (xPosition > 500) { // Reset x position after certain width
          xPosition = 50;
          yPosition += spacing;
        }
      });

      newEdges.forEach((edge) => {
        // Adjust position of target node if not yet positioned
        if (!positionMap[edge.target]) {
          positionMap[edge.target] = {
            x: positionMap[edge.source].x + spacing,
            y: positionMap[edge.source].y + spacing,
          };
        }
        addEdgeToGraph(edge);
      });

      clearGraphData(); // Clear graphData after processing to avoid re-adding
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
