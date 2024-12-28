import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFriends = createAsyncThunk(
  "users/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(import.meta.env.VITE_FETCH_FRIENDS, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      let { friends } = response.data; // Destructure friends from response.data

      if (Array.isArray(friends)) {
        friends = friends.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return friends;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const fetchFriendsSlice = createSlice({
  name: "friends",
  initialState: {
    error: null,
    status: "idle",
    friends: [],
  },
  reducers: {
    setfriends(state, action) {
      state.friends = action.payload; // Update friends state
    },
    addRequest(state, action) {
      state.friends.push(action.payload);
    },
    removeRequest(state, action) {
      const requestId = action.payload;
      state.friends = state.friends.filter(
        (request) => request._id !== requestId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setfriends, addRequest, removeRequest } =
  fetchFriendsSlice.actions;
export default fetchFriendsSlice.reducer;
