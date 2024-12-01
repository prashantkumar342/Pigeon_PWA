import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDrawer: false,
  isPeoples: false,
  isChatBox: false,
  conversation: [],
  messages: [],
  conversations: [],
  selectedConversationId: null,
  chatBoxData: { username: "", status: "", avatar: "", id: "" },
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsDrawer(state, action) {
      state.isDrawer = action.payload;
    },
    setIsPeoples(state, action) {
      state.isPeoples = action.payload;
    },
    setIsChatBox(state, action) {
      state.isChatBox = action.payload;
    },
    setConversation(state, action) {
      state.conversation = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    updateMessages(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setSelectedConversationId(state, action) {
      state.selectedConversationId = action.payload;
    },
    setChatBoxData(state, action) {
      state.chatBoxData = action.payload;
    },
    updateChatBoxData(state, action) {
      state.chatBoxData = {
        ...state.chatBoxData, // Retain the existing data
        ...action.payload, // Overwrite with new data
      };
    },
    clearChatBoxData(state) {
      state.chatBoxData = { username: "", status: "", avatar: "", id: "" };
    },
    clearAllStates(state) {
      Object.assign(state, initialState);
    },
    // New logic for updating and adding conversations
    updateConversation(state, action) {
      const index = state.conversations.findIndex(
        (convo) => convo._id === action.payload._id
      );
      if (index !== -1) {
        state.conversations[index] = action.payload;
        state.conversations = [
          state.conversations[index],
          ...state.conversations.filter((_, i) => i !== index),
        ]; // Move updated conversation to the top
      }
    },
    addConversation(state, action) {
      state.conversations = [action.payload, ...state.conversations];
    },
  },
});

export const {
  setIsDrawer,
  setIsPeoples,
  setIsChatBox,
  setConversation,
  setMessages,
  updateMessages,
  setConversations,
  updateConversation,
  addConversation,
  setSelectedConversationId,
  setChatBoxData,
  updateChatBoxData,
  clearChatBoxData,
  clearAllStates,
} = globalSlice.actions;

export default globalSlice.reducer;
