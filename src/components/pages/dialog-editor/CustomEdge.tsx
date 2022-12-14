import React from "react";
import {
  EdgeProps,
  EdgeText,
  getBezierPath,
  getSmoothStepPath,
} from "reactflow";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        onClick={(event) => data.functions.addText(event, id)}
      />
      <EdgeText x={labelX} y={labelY} label={data.text} />
    </>
  );
}
