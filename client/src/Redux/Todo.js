import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (jwtToken) => {
    const response = await axios.get("http://localhost:3001/notes/getAll", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  }
);

export const fetchIncompletedTodos = createAsyncThunk(
  "todos/fetchIncompleted",
  async (jwtToken) => {
    const response = await axios.get(
      "http://localhost:3001/notes/incompleted",
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
    return response.data;
  }
);

export const fetchCompletedTodos = createAsyncThunk(
  "todos/fetchCompleted",
  async (jwtToken) => {
    const response = await axios.get("http://localhost:3001/notes/completed", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    completedTodos: [],
    incompletedTodos: [],
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
      })
      .addCase(fetchIncompletedTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncompletedTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (Array.isArray(action.payload.incompleted)) {
          state.incompletedTodos = action.payload.incompleted;
        } else {
          state.incompletedTodos = [];
          state.error = "No notes found for this user!";
        }
      })
      .addCase(fetchIncompletedTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCompletedTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (Array.isArray(action.payload.completed)) {
          state.completedTodos = action.payload.completed;
        } else {
          state.completedTodos = [];
          state.error = "No Completed notes found for this user!";
        }
      })
      .addCase(fetchCompletedTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
