import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messagesStoreSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    updateMessageStatus(state, action) {
      const { id, status } = action.payload;
      const message = state.messages.find((msg) => msg._id === id);
      if (message) {
        message.status = status;
      }
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

// Export actions
export const { setMessages, addMessage, updateMessageStatus, clearMessages } = messagesStoreSlice.actions;

// Export reducer
export default messagesStoreSlice.reducer;
