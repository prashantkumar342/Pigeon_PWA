import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocalMessage,
  replaceLocalMessage,
  revertLocalMessage,
  setSelectedImage,
} from "../../redux/slices/global/globalSlice";
import imageCompression from "browser-image-compression";

import { useSocket } from "../../socket/socket";

function SendImage({ option1, option2, dialogTitle }) {
  const socket = useSocket();
  const {
    chatBoxData = { id: "" },
    selectedRecipientId,
    selectedImage,
  } = useSelector((state) => state.globalVar);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      try {
        const url = URL.createObjectURL(selectedImage);
        setImageUrl(url);
      } catch (error) {
        console.error("Failed to create object URL", error);
      }
    }
    return () => {
      // Cleanup: revoke the object URL when the component unmounts
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [selectedImage, imageUrl]);

  const handleSendImage = async () => {
    try {
      let cloudImageUrl = "";
      if (selectedImage) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedImage = await imageCompression(selectedImage, options);
        const formData = new FormData();
        formData.append("file", compressedImage);
        formData.append("upload_preset", "message_preset_images");

        const uploadResponse = await axios.post(
          import.meta.env.VITE_CLOUDINARY_URL,
          formData
        );
        cloudImageUrl = uploadResponse.data.secure_url;
        const tempMessageId = uuidv4();
        const newMessage = {
          _id: tempMessageId,
          tempId: tempMessageId,
          sender: userData._id,
          receiver: chatBoxData.id,
          content: cloudImageUrl,
          conversation: selectedRecipientId,
          status: "pending",
          type: "image",
          timestamp: new Date().toISOString(),
        };
        dispatch(addLocalMessage(newMessage));
        socket.emit("messageFromClient", newMessage, (response) => {
          if (response.status === "ok") {
            dispatch(
              replaceLocalMessage({
                ...response.message,
                tempId: tempMessageId,
              })
            );
          } else {
            dispatch(revertLocalMessage(tempMessageId));
          }
        });
        dispatch(setSelectedImage(null));
      }
    } catch (error) {
      console.error("error sending image", error);
    }
  };

  return (
    <Dialog
      open={Boolean(selectedImage)}
      onClose={() => dispatch(setSelectedImage(null))}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <div className="flex items-center justify-center">
        <DialogContent className="w-[230px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="selected"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          ) : (
            <p>Failed to load image</p>
          )}
        </DialogContent>
      </div>
      <DialogActions>
        <Button
          sx={{ textTransform: "none", fontSize: 17 }}
          onClick={() => dispatch(setSelectedImage(null))}
        >
          {option1}
        </Button>
        <Button
          sx={{ textTransform: "none", fontSize: 17 }}
          onClick={handleSendImage}
        >
          {option2}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SendImage.propTypes = {
  option1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  image: PropTypes.instanceOf(File), // Make sure image is a File object
};

export default SendImage;
