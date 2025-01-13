import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Access the global state
      const state = getState();
      const recipientId = state.globalVar.selectedRecipientId;

      if (!recipientId) {
        throw new Error("No recipient selected");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_FETCH_MESSAGES}/${recipientId}`,
        {
          withCredentials: true,
        }
      );
      return { responseStatus: response.status, messages: response.data };
    } catch (error) {
      const responseStatus = error.response ? error.response.status : 500;
      const messages = error.response ? error.response.data : error.message;
      return rejectWithValue({ responseStatus, messages });
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    fetchMessageLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.fetchMessageLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state) => {
        state.fetchMessageLoading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.fetchMessageLoading = false;
        state.error = action.payload.messages || "Something went wrong";
      });
  },
});

export const { actions, reducer: messagesReducer } = messagesSlice;
export default messagesReducer;
