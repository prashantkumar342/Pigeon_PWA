import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRequests = createAsyncThunk(
  "users/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(import.meta.env.VITE_FETCH_REQUEST, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      let { requests } = response.data; // Destructure requests from response.data

      if (Array.isArray(requests)) {
        requests = requests.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return requests;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const fetchRequestsSlice = createSlice({
  name: "requests",
  initialState: {
    error: null,
    status: "idle",
    requests: [],
  },
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload; // Update requests state
    },
    addRequest(state, action) {
      state.requests.push(action.payload);
    },
    removeRequest(state, action) {
      const requestId = action.payload;
      state.requests = state.requests.filter(
        (request) => request._id !== requestId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setRequests, addRequest, removeRequest } = fetchRequestsSlice.actions;
export default fetchRequestsSlice.reducer;
