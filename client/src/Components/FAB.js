import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../Redux/Todo";

export default function FloatingActionButtons() {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userData?.id);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [msg, setMsg] = React.useState("");

  const handleOpenDialog = () => {
    if (jwtToken && userId) {
      setIsDialogOpen(true);
    }
  };

  const handleSubmit = async () => {
    setMsg("");
    if (title.trim() === "") {
      setMsg("Title Cannot be Empty!");
      return;
    }
    if (title.length < 4) {
      setMsg("Min 3 char Length for Title");
      return;
    }
    if (body.length < 4) {
      setMsg("Min 3 char Length for Body");
      return;
    }
    if (body.trim() === "") {
      setMsg("Body Cannot be Empty!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3001/notes/create",
        { title, body, userId },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      if (response.status === 200) {
        setMsg("New Todo Added!");
        dispatch(fetchTodos(jwtToken));
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMsg(error.response.data.message);
        console.error(error.response.data);
      } else {
        setMsg("An Error occured when Add! ", error);
        console.error("An Error occured when Add! ", error);
      }
    } finally {
      setLoading(false);
      setMsg("");
      setTitle("");
      setBody("");
    }
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px", // Adjust this value to set the distance from the bottom
        right: "20px", // Adjust this value to set the distance from the right
        "& > :not(style)": { m: 1 },
      }}
    >
      <Fab color="secondary" aria-label="edit" onClick={handleOpenDialog}>
        <EditIcon />
      </Fab>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add Todo</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Title"
            fullWidth
            InputLabelProps={{ sx: { zIndex: 2, color: "inherit" } }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            label="Body"
            fullWidth
            multiline
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <Typography
            sx={{
              alignSelf: "flex-end",
              color: "black",
              fontSize: "12px",
            }}
          >
            {loading && <strong>Loading...</strong>}
          </Typography>
          <Typography
            sx={{
              alignSelf: "flex-end",
              color: "black",
              fontSize: "12px",
            }}
          >
            {msg && <strong>{msg}</strong>}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
