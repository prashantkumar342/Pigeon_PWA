import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import imageCompression from "browser-image-compression";

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "registerUser",
  async (userCreds, { rejectWithValue }) => {
    const { username, email, password, avatar } = userCreds;
    try {
      let avatarUrl = "";
      if (avatar) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedAvatar = await imageCompression(avatar, options);
        const formData = new FormData();
        formData.append("file", compressedAvatar);
        formData.append("upload_preset", "chatty_avatar_preset");

        const uploadResponse = await axios.post(
          import.meta.env.VITE_CLOUDINARY_URL,
          formData
        );
        avatarUrl = uploadResponse.data.secure_url;
      }

      // Register user with the avatar URL
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/register`,
        {
          username,
          email,
          password,
          avatar: avatarUrl,
        },
        { withCredentials: true }
      );
      return response.status;
    } catch (error) {
      return rejectWithValue(error.response?.status ?? "Unknown error");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerSlice.reducer;
