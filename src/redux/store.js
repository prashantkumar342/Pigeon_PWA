import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import registerUserReducer from "./slices/api/registerSlice";
import authenticateUserReducer from "./slices/api/authenticateSlice";
import userSliceReducer from "./slices/global/userSlice";
import globalsliceReducer from "./slices/global/globalSlice";
import fetchUsersReducer from "./slices/api/fetchUsersSlice";
import logoutUserReducer from "./slices/api/logoutSlice";
import recipientReducer from "./slices/api/recipientSlice";
import conversationReducer from "./slices/api/conversationSlice";
import messagesReducer from "./slices/api/messagesSlice";
import fetchRequestsReducer from "./slices/api/fetchRequestSlice";
import fetchFriendsReducer from "./slices/api/fetchFriendsSlice";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "globalVar", "messages", "conversation", "recipient"],
};

const rootReducer = combineReducers({
  registerUser: registerUserReducer,
  authenticateUser: authenticateUserReducer,
  user: userSliceReducer,
  globalVar: globalsliceReducer,
  users: fetchUsersReducer,
  logout: logoutUserReducer,
  recipient: recipientReducer,
  conversation: conversationReducer,
  messages: messagesReducer,
  requests: fetchRequestsReducer,
  friends: fetchFriendsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    }),
});

export const persistor = persistStore(reduxStore);
