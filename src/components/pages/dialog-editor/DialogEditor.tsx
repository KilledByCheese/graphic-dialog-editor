import { Button, Container } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  updateEdge,
  EdgeProps,
  applyEdgeChanges,
} from "reactflow";
import CustomNode from "./CustomNode";
import _ from "lodash";
import "reactflow/dist/style.css";
import CustomEdge from "./CustomEdge";
import SimpleTextModal from "../../ui-elements/SimpleTextModal";

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

const edgeTypes = {
  custom: CustomEdge,
};

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
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
    (params: Edge | Connection) => {
      let newId = uuidv4();
      setEdges((els) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#0000FF",
            },
            style: {
              strokeWidth: 2,
              stroke: "#0000FF",
            },
            id: newId,
            type: "custom",
            data: {
              text: "yoot",
              functions: {
                addText: addTextToEdge,
              },
            },
          },
          els
        )
      );
    },
    [setEdges]
  );

  function addTextToEdge(event: React.MouseEvent<any>, id: string) {
    event.stopPropagation();
    setEditId(id);
    setOpen(true);
  }

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

  const [editId, setEditId] = useState("");
  function removeState(id: string) {
    let node: Node = reactFlowInstance.getNode(id)!;
    let temp = {
      nodes: [node],
    };
    reactFlowInstance.deleteElements(temp);
  }

  function submitFunction(data: any) {
    let newId = uuidv4();
    let target = reactFlowInstance.getEdge(editId)!.target;
    let source = reactFlowInstance.getEdge(editId)!.source;
    reactFlowInstance.deleteElements({
      edges: [reactFlowInstance.getEdge(editId)!],
    });
    let temp: Edge = {
      source: source,
      target: target,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#0000FF",
      },
      style: {
        strokeWidth: 2,
        stroke: "#0000FF",
      },
      id: newId,
      type: "custom",
      data: {
        text: data.text,
        functions: {
          addText: addTextToEdge,
        },
      },
    };

    reactFlowInstance.addEdges(temp);
    setOpen(false);
  }

  function editState(id: string) {
    console.log("edit ", id);
  }

  const [open, setOpen] = useState(false);

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
          connectionLineStyle={connectionLineStyle}
          edgeTypes={edgeTypes}
        >
          <Background />
        </ReactFlow>
      </div>
      <SimpleTextModal
        show={open}
        handleClose={() => {
          setOpen(false);
          setEditId("");
        }}
        title="Enter a Text"
        submitFunction={submitFunction}
      />
    </Container>
  );
}

export default DialogEditor;
