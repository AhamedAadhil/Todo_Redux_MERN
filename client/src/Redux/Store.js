import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User";
import todoReducer from "./Todo";

export const Store = configureStore({
  reducer: {
    user: userReducer,
    todos: todoReducer,
  },
});
