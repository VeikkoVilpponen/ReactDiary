import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

interface Props {
  isDialogOpen: boolean,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  addNewEntry: (title: string, content: string) => void
}

const EditEntry: React.FC<Props> = (props: Props): React.ReactElement => {

  const formRef: any = useRef<HTMLFormElement>();
  const quillRef: any = useRef<any>();

  const save = (e: React.FormEvent): void => {
    e.preventDefault();
    
    props.addNewEntry(
      formRef.current.title.value, 
      quillRef.current.getEditorContents()
    );
    
    props.setDialogOpen(false);
  }  

  const cancel = (): void => {
    props.setDialogOpen(false);
  } 

  return (
    <Dialog
      maxWidth="lg" 
      fullWidth={true}
      open={props.isDialogOpen} 
      onClose={cancel}
    >
      <DialogTitle>Add a new entry</DialogTitle>
      <DialogContent style={{ paddingTop: 10 }}>
        <Stack 
          spacing={1} 
          component="form"
          onSubmit={save}
          ref={formRef}
        >
          <TextField
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
          />

          <ReactQuill
            ref={quillRef}
            style={{
              height: 200,
              marginBottom: 50
            }}
          />

          <Button 
            variant="contained"
            type="submit"
          >Save</Button>

          <Button
            variant="outlined"
            onClick={cancel}
          >Cancel</Button>

        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntry;