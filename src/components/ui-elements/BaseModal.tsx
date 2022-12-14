import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { createPortal } from "react-dom";

interface Props {
  show: boolean;
  onHide: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function BaseModal({
  show,
  onHide,
  title,
  footer,
  children,
}: Props) {
  const portalElement = document.getElementById("overlays") as HTMLElement;

  return createPortal(
    <Dialog
      open={show}
      onClose={onHide}
      PaperProps={{
        sx: {
          width: "70%",
          maxHeight: 500,
        },
      }}
    >
      <DialogTitle id="dialogTitle-modals" sx={{ m: 0, p: 2, marginBottom: 0 }}>
        <div id="dialogTitle">{title}</div>
        <IconButton
          onClick={onHide}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div id="bodyContent">{children}</div>
      </DialogContent>
      {footer}
    </Dialog>,
    portalElement
  );
}
