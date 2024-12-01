import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setUserData, setLoggedIn } from "../global/userSlice";

// Define the async thunk for authentication
export const authenticateUser = createAsyncThunk(
  "auth/authenticateUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_AUTHENTICATIE,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(setUserData(response.data.user));
        dispatch(setLoggedIn(true));
      }

      return response.status;
    } catch (error) {
      return rejectWithValue(error.response?.status ?? "Unknown error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state) => {
        state.authLoading = false;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
