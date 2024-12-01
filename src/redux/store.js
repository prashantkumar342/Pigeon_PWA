import { configureStore } from "@reduxjs/toolkit";
import registerUserReducer from "./slices/api/registerSlice";
import authenticateUserReducer from "./slices/api/authenticateSlice";
import userSliceReducer from "./slices/global/userSlice";
import globalsliceReducer from "./slices/global/globalSlice";
import fetchUsersReducer from "./slices/api/fetchUsersSlice";
import logoutUserReducer from "./slices/api/logoutSlice";
import recipientReducer from "./slices/api/recipientSlice";
import conversationReducer from "./slices/api/conversationSlice";
import messagesReducer from "./slices/api/messagesSlice";

export const reduxStore = configureStore({
  reducer: {
    registerUser: registerUserReducer,
    authenticateUser: authenticateUserReducer,
    user: userSliceReducer,
    globalVar: globalsliceReducer,
    users: fetchUsersReducer,
    logout: logoutUserReducer,
    recipient: recipientReducer,
    conversation: conversationReducer,
    messages:messagesReducer,
  },
});
