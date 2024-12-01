import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(import.meta.env.VITE_FETCH_USERS, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: { search: searchQuery }, 
      });
      return response.data; 
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue("No response received from server");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const fetchUsersSlice = createSlice({
  name: "users",
  initialState: {
    fetchLoading: false,
    error: null,
    users: [],
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      });
  },
});
export const { setUsers } = fetchUsersSlice.actions;
export default fetchUsersSlice.reducer;
