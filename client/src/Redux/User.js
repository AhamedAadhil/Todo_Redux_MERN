import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("Token") || null,
  session: sessionStorage.getItem("session") || null,
  userData: JSON.parse(localStorage.getItem("UserData")) || null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.token = action.payload.token;
      state.session = action.payload.session;
      state.userData = action.payload.userData;

      localStorage.setItem("Token", action.payload.token);
      sessionStorage.setItem("session", action.payload.session);
      localStorage.setItem("UserData", JSON.stringify(action.payload.userData));
    },
    logoutUser: (state) => {
      state.token = null;
      state.session = null;
      state.userData = null;

      localStorage.removeItem("Token");
      sessionStorage.removeItem("session");
      localStorage.removeItem("UserData");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
