import { Button, Stack } from "@mui/material";
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
} from "reactflow";
import CustomNode from "./CustomNode";
import "reactflow/dist/style.css";
import CustomEdge from "./CustomEdge";
import SimpleTextModal from "../../ui-elements/SimpleTextModal";
import isValidDialog from "../../../util/dialogValidator";

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

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
    transformToJson();
  }, [edges]);

  useEffect(() => {
    console.log("nodes", nodes);
    transformToJson();
  }, [nodes]);

  const [dialogJson, setDialogJson] = useState({});
  const [valid, setValid] = useState(false);
  function transformToJson() {
    let dialog: any = {
      "@id": "Test-Dialog",
      "@type": "Dialog",
      states: [],
    };
    nodes.forEach((node) => {
      let edgesFiltered = edges.filter((edge) => edge.source === node.id);
      let state: any = {
        state: node.data.label,
      };
      if (edgesFiltered.length >= 1) {
        state.response = [];
      }
      edgesFiltered.forEach((edge) => {
        let targetNode = reactFlowInstance.getNode(edge.target)!;
        let response: any = {
          goto: targetNode.data.label,
        };
        if (edge.data.text !== "") {
          response.recognizes = [edge.data.text];
        }
        state.response.push(response);
      });
      dialog.states.push(state);
    });
    setValid(isValidDialog(dialog));
    setDialogJson(dialog);
  }

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
              text: "",
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
    setEditEdge(id);
    setOpenEditEdge(true);
  }

  function addState() {
    let newId = uuidv4();
    let furthestPosY = 100;
    reactFlowInstance.getNodes().forEach((node) => {
      if (node.position.y >= furthestPosY) {
        furthestPosY = node.position.y + 150;
      }
    });
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
      position: { x: 100, y: furthestPosY },
    };
    reactFlowInstance.addNodes([newState]);
  }

  const [editEdge, setEditEdge] = useState("");
  function removeState(id: string) {
    let node: Node = reactFlowInstance.getNode(id)!;
    let temp = {
      nodes: [node],
    };
    reactFlowInstance.deleteElements(temp);
  }

  function submitNodeFunction(data: any) {
    let uniqueLabel = true;
    nodes.forEach((node) => {
      if (node.data.label === data.text) {
        uniqueLabel = false;
      }
    });
    if (!uniqueLabel) return; //Label is not Unique stopping update
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editNode) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: data.text,
          };
        }

        return node;
      })
    );

    setEditNode("");
    setOpenEditNode(false);
  }

  function submitEdgeTextFunction(data: any) {
    let newId = uuidv4();
    let target = reactFlowInstance.getEdge(editEdge)!.target;
    let source = reactFlowInstance.getEdge(editEdge)!.source;
    reactFlowInstance.deleteElements({
      edges: [reactFlowInstance.getEdge(editEdge)!],
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
    setEditEdge("");
    setOpenEditEdge(false);
  }

  const [editNode, setEditNode] = useState("");
  function editState(id: string) {
    setEditNode(id);
    setOpenEditNode(true);
  }

  const [openEditEdge, setOpenEditEdge] = useState(false);
  const [openEditNode, setOpenEditNode] = useState(false);

  return (
    <div>
      <Stack direction={"row"} spacing={2}>
        <Button variant="contained" onClick={addState}>
          Add State
        </Button>
        {/* <Button variant="contained" onClick={transformToJson}>
          To JSON
        </Button> */}
      </Stack>
      <Stack direction={"row"}>
        <div style={{ height: "80vh", width: "50%", border: "3px solid blue" }}>
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
        <div
          style={{
            height: "80vh",
            width: "50%",
            border: "3px solid grey",
            overflow: "scroll",
          }}
        >
          <p>Dialog Valid? = {valid.toString()}</p>
          <hr />
          <pre>{JSON.stringify(dialogJson, null, 2)}</pre>
        </div>
      </Stack>
      <SimpleTextModal
        show={openEditEdge}
        handleClose={() => {
          setOpenEditEdge(false);
          setEditEdge("");
        }}
        title="Enter a Edge Text"
        submitFunction={submitEdgeTextFunction}
      />
      <SimpleTextModal
        show={openEditNode}
        handleClose={() => {
          setOpenEditNode(false);
          setEditNode("");
        }}
        title="Enter a Edge Text"
        submitFunction={submitNodeFunction}
      />
    </div>
  );
}

export default DialogEditor;
