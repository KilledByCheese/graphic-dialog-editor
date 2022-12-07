import { Button, Container } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  NodeRemoveChange,
  NodeAddChange,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  useReactFlow,
} from "reactflow";
import CustomNode from "./CustomNode";

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  /*{
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 100 } },
  { id: "3", data: { label: "Node 3" }, position: { x: 400, y: 100 } },
  {
    id: "4",
    type: "custom",
    data: { label: "Node 4" },
    position: { x: 400, y: 200 },
  },*/
];

const initialEdges: Edge[] = [
  //{ id: "e1-2", source: "1", target: "2", animated: true },
  //{ id: "e1-3", source: "1", target: "3" },
];

const nodeTypes = {
  custom: CustomNode,
};

function DialogEditor() {
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    console.log("edges", edges);
  }, [edges]);

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);

  // const onNodesChange = useCallback(
  //   (changes: NodeChange[]) =>
  //     setNodes((nds) => applyNodeChanges(changes, nds)),
  //   []
  // );
  // const onEdgesChange = useCallback(
  //   (changes: EdgeChange[]) =>
  //     setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   []
  // );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  function addState() {
    let newId = uuidv4();
    let newState = {
      id: newId,
      type: "custom",
      data: {
        label: `New-State-${newId}`,
        functions: {
          delete: removeState,
          edit: editState,
        },
      },
      position: { x: 100, y: 100 },
    };
    reactFlowInstance.addNodes([newState]);
  }

  function removeState(id: string) {
    let node: Node = reactFlowInstance.getNode(id)!;
    let temp = {
      nodes: [node],
    };
    reactFlowInstance.deleteElements(temp);
  }

  function editState(id: string) {
    console.log("edit ", id);
  }

  return (
    <Container>
      <Button variant="contained" onClick={addState}>
        Add State
      </Button>
      <div style={{ height: "80vh", border: "1px solid blue" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background />
        </ReactFlow>
      </div>
    </Container>
  );
}

export default DialogEditor;
