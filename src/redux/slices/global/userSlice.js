import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isLoggedIn: false,
  },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    clearUserData(state) {
      state.userData = null;
    },
  },
});

export const { setUserData, clearUserData, setLoggedIn } = userSlice.actions;

export default userSlice.reducer;
