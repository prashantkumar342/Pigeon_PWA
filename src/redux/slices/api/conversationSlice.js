import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchConversation = createAsyncThunk(
  "conversation/fetchConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/fetch/conversations`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      let conversations = response.data;

      if (Array.isArray(conversations)) {
        conversations = conversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        return conversations;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversation: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { actions, reducer: conversationReducer } = conversationSlice;
export default conversationReducer;
