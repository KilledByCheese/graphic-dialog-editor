import { FormControl, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import BaseModal from "./BaseModal";

interface Props {
  show: boolean;
  handleClose: () => void;
  title: string;
  submitFunction: (data: any) => void;
}

export default function SimpleTextModal({
  show,
  handleClose,
  title,
  submitFunction,
}: Props) {
  const [text, setText] = useState("");

  const { register, handleSubmit } = useForm();

  const innerSubmitFunction = (data: any) => {
    submitFunction(data);
    setText("");
  };

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      title={title}
      footer={
        <DialogActions>
          <Button onClick={handleClose} sx={{ width: 150 }}>
            {"CANCEL"}
          </Button>

          <Button
            sx={{ width: 150 }}
            id="importButton"
            onClick={handleSubmit(innerSubmitFunction)}
          >
            {"SAVE"}
          </Button>
        </DialogActions>
      }
    >
      <FormControl onSubmit={handleSubmit(innerSubmitFunction)}>
        <Stack>
          <TextField
            label={"Enter Text"}
            {...register("text", {
              required: true,
              minLength: 1,
            })}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </Stack>
      </FormControl>
    </BaseModal>
  );
}
