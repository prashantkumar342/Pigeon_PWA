import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch the recipient
export const fetchRecipient = createAsyncThunk(
  "recipient/fetchRecipient",
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/fetch/recipient`,
        { recipient: recipientId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const recipientSlice = createSlice({
  name: "recipient",
  initialState: {
    recipient: null,
    recipientLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipient.pending, (state) => {
        state.recipientLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipient.fulfilled, (state) => {
        state.recipientLoading = false;
        state.status = "succeeded";
      })
      .addCase(fetchRecipient.rejected, (state, action) => {
        state.recipientLoading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { actions, reducer: recipientReducer } = recipientSlice;
export default recipientReducer;
