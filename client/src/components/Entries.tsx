import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Alert, Backdrop, Box, CircularProgress, Stack, Typography, Button, Dialog, DialogContent, DialogTitle, ListItemIcon, IconButton, ListItem, ListItemText } from '@mui/material';
import { format, parseJSON } from 'date-fns';
import { Routes, Route, useNavigate, NavigateFunction } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditEntry from './EditEntry';

interface Data {
  entries: any[],
  error: string,
  dataFetched: boolean
}

interface Props {
  token: string,
  setToken: Dispatch<SetStateAction<string>>
}

const Entries: React.FC<Props> = (props: Props): React.ReactElement => {

  const [data, setData] = useState<Data>({
    entries: [],
    error: "",
    dataFetched: false
  });

  const navigate: NavigateFunction = useNavigate();

  const fetchEntries = async (settings: any): Promise<void> => {
    const response = await fetch("http://localhost:3110/api/entries", settings);

    setData({
      ...data,
      entries: await response.json(),
      dataFetched: true
    });
  };

  useEffect(() => {
    fetchEntries({
      method: "GET",
      headers: {
        'Authorization': `Bearer ${props.token}`
      }
    });
  }, []);

  const [addNew, setAddNew] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState();
  const [dialogContent, setDialogContent] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openDialog = (title: any, content: any): void => {
    setIsDialogOpen(true);
    setDialogTitle(title);
    setDialogContent(content);
  }

  const cancelDialog = (): void => {
    setIsDialogOpen(false);
  }

  const logout = async (): Promise<void> => {
    await props.setToken("");
    navigate("/");
  }

  const addNewEntry = async (title: string, content: string): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3110/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${props.token}`
        },
        body: JSON.stringify({
          title: title,
          content: content
        })
      });

      const newEntry = await response.json();

      setData({
        ...data,
        dataFetched: true,
        entries: [...data.entries, newEntry]
      });
    } catch (e: any) {
      setData({
        ...data,
        error: "Unable to connect to the server.",
        dataFetched: true
      });
    }
  }

  const deleteEntry = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3110/api/entries/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${props.token}`
        }
      });

      const deletedEntry = await response.json();

      setData({
        ...data,
        dataFetched: true,
        entries: [...data.entries.filter((entry) => entry.id !== deletedEntry.id)]
      });

    } catch (e: any) {
      setData({
        ...data,
        error: "Unable to connect to the server.",
        dataFetched: true
      });
    }
  }

  return (Boolean(data.error))
    ? <Alert severity="error">
      {data.error}
    </Alert>
    : (data.dataFetched)
      ? <>
        {data.entries.slice(0).reverse().map((entry: any, idx: number) => {
          return <Box key={idx} sx={{ outline: 1}}>
            <Stack spacing={1}>
              <ListItem key={idx}  >
                <ListItemText onClick={() => {
                  openDialog(entry.title + " " + format(parseJSON(entry.createdAt), "dd.MM.yyyy  HH:mm"), <span dangerouslySetInnerHTML={{ __html: entry.content }} />)
                }}  primary={entry.title} />
                 <ListItemText onClick={() => {
                  openDialog(entry.title + " " + format(parseJSON(entry.createdAt), "dd.MM.yyyy  HH:mm"), <span dangerouslySetInnerHTML={{ __html: entry.content }} />)
                }} primary={format(parseJSON(entry.createdAt), "dd.MM.yyyy  HH:mm")} />
                <ListItemIcon>
                  <IconButton onClick={() => { deleteEntry(Number(entry.id)) }}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
              <Dialog
                maxWidth="lg"
                fullWidth={true}
                open={isDialogOpen}
                onClose={cancelDialog}
              >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent style={{ paddingTop: 10 }}>
                  <Stack
                    spacing={1}
                    component="form"
                  >
                    <Typography>{dialogContent}</Typography>

                    <Button
                      variant="outlined"
                      onClick={cancelDialog}
                    >Back</Button>

                  </Stack>
                </DialogContent>

              </Dialog>
            </Stack>
          </Box>
        })}

        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          onClick={() => { setAddNew(true) }}
        >Add a new entry</Button>

        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          onClick={() => { logout() }}
        >Logout</Button>

        <EditEntry isDialogOpen={addNew} setDialogOpen={setAddNew} addNewEntry={addNewEntry} />
      </>
      : <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
}

export default Entries;