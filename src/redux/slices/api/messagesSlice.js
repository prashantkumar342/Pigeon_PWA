import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Access the global state
      const state = getState();
      const conversationId = state.globalVar.selectedConversationId;

      if (!conversationId) {
        throw new Error("No conversation selected");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_FETCH_MESSAGES}/${conversationId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { actions, reducer: messagesReducer } = messagesSlice;
export default messagesReducer;
