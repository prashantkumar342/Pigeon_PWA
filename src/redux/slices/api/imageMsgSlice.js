import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import imageCompression from "browser-image-compression";

// Async thunk for user registration
export const imageMessage = createAsyncThunk(
  "imageMessage",
  async (userCreds, { rejectWithValue }) => {
    const {  avatar } = userCreds;
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
        import.meta.env.VITE_REG_USER,
        {
          type:'image',
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

const imageMsgSlice = createSlice({
  name: "image",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(imageMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(imageMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(imageMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default imageMsgSlice.reducer;
