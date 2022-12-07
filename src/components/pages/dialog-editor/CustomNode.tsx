import { IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

const CustomNode = ({
  data,
  id,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  return (
    <div style={{ border: "1px solid red", padding: "25px" }}>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <Stack direction="row">
        <Typography variant="h6">{data?.label}</Typography>
        <IconButton onClick={() => data.functions.edit(id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => data.functions.delete(id)}>
          <DeleteForeverIcon />
        </IconButton>
      </Stack>
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </div>
  );
};

CustomNode.displayName = "CustomNode";

export default memo(CustomNode);
