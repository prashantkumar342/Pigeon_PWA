import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatBoxData,
  setSelectedRecipientId,
  setMessages,
} from "../../redux/slices/global/globalSlice";
import { fetchMessages } from "../../redux/slices/api/messagesSlice";
import { useEffect } from "react";
import { useSocket } from "../../socket/socket";
import { useNavigate } from "react-router-dom";
import { Message } from "@mui/icons-material";

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const {
    chatBoxData = { username: "", status: "", avatar: "", id: "" },
    recipient,
  } = useSelector((state) => state.globalVar);

  useEffect(() => {
    if (socket) {
      const handleStatus = (data) => {
        if (chatBoxData.username === data.user) {
          dispatch(
            updateChatBoxData({
              username: data.user,
              status: data.onlineStatus,
            })
          );
        }
      };

      socket.on("onStatus", handleStatus);

      return () => {
        socket.off("onStatus", handleStatus);
      };
    }
  }, [socket, chatBoxData, dispatch]);

  const handleBack = () => {
    dispatch(setSelectedRecipientId(null));
    navigate("/dashboard/chat");
  };

  const handleSendMessage = () => {
    if (recipient) {
      dispatch(fetchMessages()).then((response) => {
        const { responseStatus, messages } = response.payload;
        if (responseStatus !== 200) {
          dispatch(setMessages([]));
        } else {
          dispatch(setMessages(messages));
        }
      });
      navigate(`/dashboard/chat?conversationId=${recipient._id}`);
    }
  };

  return (
    <div className="flex-grow max-sm:w-screen h-full overflow-y-auto flex flex-col max-sm:fixed top-0 bg-white">
      <ListItem className="px-4 bg-gray-100 h-14">
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: "transparent",
            color: "#AD49E1",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <ListItemAvatar>
          <Avatar sx={{ width: 40, height: 40 }} src={chatBoxData?.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={chatBoxData?.username}
          secondary={chatBoxData?.status}
        />
      </ListItem>
      <Box p={4} textAlign="center">
        <Avatar
          src={chatBoxData?.avatar}
          alt={chatBoxData?.username}
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />
        <Typography variant="h5" gutterBottom>
          {chatBoxData?.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {chatBoxData?.status}
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Message />}
            sx={{
              mb: 2,
              textTransform: "none",
              backgroundColor: "#AD49E1",
              "&:hover": { backgroundColor: "#25D366" },
            }}
            onClick={handleSendMessage}
          >
            Send Message
          </Button>
          <Divider />
          <Box mt={4} textAlign="left">
            <Typography variant="h6">User Details</Typography>
            <Typography variant="body2" color="textSecondary">
              {recipient?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {recipient?.phone}
            </Typography>
            {/* Add more user details as needed */}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default UserProfile;
