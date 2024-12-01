import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCreds, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_LOGIN_USER,
        {
          username: userCreds.username,
          password: userCreds.password,
        },
        { withCredentials: true }
      );
      console.log(response.status);
      return response.status;
    } catch (error) {
      return rejectWithValue(error.response?.status ?? "Unknown error");
    }
  }
);

const loginSlice = createSlice({
  name: "auth",
  initialState: {
    loginLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
