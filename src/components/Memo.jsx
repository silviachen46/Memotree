
// import React, { useCallback, useEffect } from 'react';
// import ReactFlow, {
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import './Memo.css';

// const initialNodes = [];
// const initialEdges = [];

// function Memo({ graphData, clearGraphData }) {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const addNode = (nodeData) => {
//     const { id, name, attributes } = nodeData;

//     // Prepare label with optional details like duration and timeframe if present
//     let label = name;
//     if (attributes) {
//       const details = Object.entries(attributes)
//         .map(([key, value]) => `${key}: ${value}`)
//         .join(', ');
//       label = `${name}\n${details}`;
//     }

//     const newNode = {
//       id,
//       data: { label },
//       position: { x: Math.random() * 500, y: Math.random() * 500 },
//       type: 'default',
//     };
//     setNodes((nds) => [...nds, newNode]);
//   };

//   const addEdgeToGraph = (edgeData) => {
//     const newEdge = {
//       id: `${edgeData.source}-${edgeData.target}`,
//       source: edgeData.source,
//       target: edgeData.target,
//       type: edgeData.type,
//     };
//     setEdges((eds) => [...eds, newEdge]);
//   };

//   // Process graphData when it changes
//   useEffect(() => {
//     if (graphData) {
//       const { nodes: newNodes, edges: newEdges } = graphData;

//       // Add or update nodes
//       newNodes.forEach((node) => {
//         if (!nodes.find((n) => n.id === node.id)) {
//           addNode(node);
//         } else {
//           // Update existing node's label with new attributes if already present
//           setNodes((nds) =>
//             nds.map((n) =>
//               n.id === node.id
//                 ? {
//                     ...n,
//                     data: {
//                       ...n.data,
//                       label: `${node.name}\n${Object.entries(node.attributes || {})
//                         .map(([key, value]) => `${key}: ${value}`)
//                         .join(', ')}`,
//                     },
//                   }
//                 : n
//             )
//           );
//         }
//       });

//       // Add edges
//       newEdges.forEach((edge) => {
//         if (!edges.find((e) => e.source === edge.source && e.target === edge.target)) {
//           addEdgeToGraph(edge);
//         }
//       });

//       clearGraphData(); // Clear graphData after processing to avoid re-adding
//     }
//   }, [graphData, nodes, edges, clearGraphData]);

//   return (
//     <div className="memo-container">
//       <div className="reactflow-wrapper">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           fitView
//         >
//           <Background />
//           <Controls />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// }

// export default Memo;
// Memo.jsx
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

const initialNodes = [];
const initialEdges = [];

function Memo({ graphData, clearGraphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (nodeData, position) => {
    const { id, name, attributes } = nodeData;

    // Prepare label with optional attributes for clearer display
    let label = `${name}`;
    if (attributes && Object.keys(attributes).length > 0) {
      const details = Object.entries(attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      label = `${name}\n${details}`;
    }

    const newNode = {
      id,
      data: { label },
      position,
      type: 'default',
    };
    setNodes((nds) => [...nds, newNode]);
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
        addNode(node, position);

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
