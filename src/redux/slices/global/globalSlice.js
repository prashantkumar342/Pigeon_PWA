import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages } from "../api/messagesSlice";

const initialState = {
  isDrawer: false,
  isPeoples: false,
  isChatBox: false,
  conversation: [],
  messages: [], // Initialize messages as an array
  conversations: [],
  selectedRecipientId: null,
  chatBoxData: { username: "", status: "", avatar: "", id: "" },
  recipient: {},
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setRecipient(state, action) {
      state.recipient = action.payload;
    },
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
    setSelectedRecipientId(state, action) {
      state.selectedRecipientId = action.payload;
    },
    setChatBoxData(state, action) {
      state.chatBoxData = action.payload;
    },
    updateChatBoxData(state, action) {
      state.chatBoxData = {
        ...state.chatBoxData,
        ...action.payload,
      };
    },
    clearChatBoxData(state) {
      state.chatBoxData = { username: "", status: "", avatar: "", id: "" };
    },
    clearAllStates(state) {
      Object.assign(state, initialState);
    },
    updateConversation(state, action) {
      const index = state.conversations.findIndex(
        (convo) => convo._id === action.payload._id
      );
      if (index !== -1) {
        state.conversations[index] = action.payload;
        state.conversations = [
          state.conversations[index],
          ...state.conversations.filter((_, i) => i !== index),
        ];
      }
    },
    addConversation(state, action) {
      state.conversations = [action.payload, ...state.conversations];
    },
    addLocalMessage(state, action) {
      state.messages.push(action.payload);
    },
    replaceLocalMessage(state, action) {
      const index = state.messages.findIndex(
        (msg) =>
          msg._id === action.payload._id || msg.tempId === action.payload.tempId
      );
      if (index !== -1) {
        state.messages[index] = action.payload;
      } else {
        state.messages.push(action.payload);
      }
    },
    revertLocalMessage(state, action) {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload && msg.tempId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
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
  setSelectedRecipientId,
  setChatBoxData,
  updateChatBoxData,
  clearChatBoxData,
  clearAllStates,
  addLocalMessage,
  replaceLocalMessage,
  revertLocalMessage,
  setRecipient,
} = globalSlice.actions;

export default globalSlice.reducer;
