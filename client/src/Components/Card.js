import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../Redux/Todo";

// Utility function to generate a random color in RGB format
const getRandomColor = () => {
  const colors = ["#87CEFA", "#98FB98", "#FFD700", "#FF1493", "#00FFFF"];
  const randomColor = Math.floor(Math.random() * colors.length);
  return colors[randomColor];
};

function formatTimeToAMPM(timeString) {
  const date = new Date(timeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  hours %= 12;
  hours = hours || 12; // 12:00 should be 12:00 pm

  // Pad the hours and minutes with leading zeros if needed
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return `${formattedDate} ${formattedHours}:${formattedMinutes} ${ampm}`;
}

const TodoCard = ({ todo, index }) => {
  const jwtToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState(todo.title);
  const [body, setBody] = useState(todo.body);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleOpenDialog = () => {
    if (jwtToken) {
      setTitle(todo.title);
      setBody(todo.body);
      setIsDialogOpen(true);
    }
  };

  const handleUpdate = async () => {
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
      const response = await axios.patch(
        `http://localhost:3001/notes/update/${todo._id}`,
        { title, body },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      if (response.status === 200) {
        setMsg("Todo Updated!");
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

  const handleDelete = async (id) => {
    setMsg("");
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3001/notes/delete/${id}`,
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      if (response.status === 200) {
        setLoading(false);
        setMsg("Todo Deleted!");
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
        setMsg("An Error occured when Delete! ", error);
        console.error("An Error occured when Delete! ", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    setMsg("");
    try {
      setLoading(true);
      // Toggle the completion state
      const updatedTodo = { ...todo, isComplete: !todo.isCompleted };
      const response = await axios.patch(
        `http://localhost:3001/notes/${
          updatedTodo.isComplete ? "mac" : "maic"
        }/${todo._id}`,
        {},
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      if (response.status === 200) {
        setLoading(false);
        setMsg(
          `Note marked as ${
            updatedTodo.isCompleted ? "inCompleted" : "complete"
          }!`
        );
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
        setMsg("An Error occurred when updating the todo! ", error);
        console.error("An Error occurred when updating the todo! ", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: getRandomColor(),
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ alignSelf: "flex-start", color: "white", cursor: "pointer" }}
            textTransform="capitalize"
            onClick={handleOpenDialog}
          >
            <strong>{todo.title}</strong>
          </Typography>
          <Typography
            sx={{
              flexGrow: 1,
              alignSelf: "flex-start",
              color: "white",
            }}
          >
            {todo.body}
          </Typography>
          <Typography
            sx={{
              alignSelf: "flex-end",
              color: "dark grey",
              fontSize: "12px",
            }}
          >
            {formatTimeToAMPM(todo.date)}
          </Typography>
          <Box
            sx={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton onClick={() => handleDelete(todo._id)}>
              <DeleteIcon sx={{ color: "#d11a2a" }} />
              <Typography
                sx={{
                  alignSelf: "flex-end",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                {loading && <strong>Loading...</strong>}
              </Typography>
              <Typography
                sx={{
                  alignSelf: "flex-end",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                {msg && <strong>{msg}</strong>}
              </Typography>
            </IconButton>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ color: "white" }}
                    checked={todo.isCompleted}
                    onChange={handleToggleComplete}
                  />
                }
                label="Complete"
                sx={{ color: "white" }}
              />
            </FormGroup>
          </Box>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Update Todo</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
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
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoCard;
