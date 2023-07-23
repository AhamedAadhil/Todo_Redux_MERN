import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (jwtToken) => {
    const response = await axios.get("http://localhost:3001/notes/getAll", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    console.log(response.data);
    return response.data;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (Array.isArray(action.payload.notes)) {
          state.todos = action.payload.notes;
        } else {
          state.todos = [];
          state.error = "No notes found for this user!";
        }
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
