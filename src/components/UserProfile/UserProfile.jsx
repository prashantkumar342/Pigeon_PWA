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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatBoxData,
  setSelectedRecipientId,
  setMessages,
} from "../../redux/slices/global/globalSlice";
import MoreOptions from "../Menus/MoreOptions";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fetchMessages } from "../../redux/slices/api/messagesSlice";
import { setUserData } from "../../redux/slices/global/userSlice";
import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socket";
import { useNavigate } from "react-router-dom";
import { Message } from "@mui/icons-material";
import CustomPrompt from "../Prompt/CustomPrompt";

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [customPrompt, setCustomPrompt] = useState(false);
  const socket = useSocket();
  const {
    chatBoxData = { username: "", status: "", avatar: "", id: "" },
    recipient,
    selectedRecipientId,
  } = useSelector((state) => state.globalVar);
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (socket) {
      socket.on("updateProfile", (updatedUser) => {
        if (updatedUser._id === userData._id) {
          dispatch(setUserData(updatedUser));
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("updateProfile");
      }
    };
  }, [socket, dispatch, userData._id]);

  const sendRequest = (recpId, sender) => {
    socket.emit("friendRequest", { from: sender, to: recpId });
  };
  const removeFriend = (friend, wantToRemove) => {
    socket.emit("removeFriend", { friend, wantToRemove });
  };
  const acceptRequestFromUsers = (userId) => {
    socket.emit("acceptRequestFromUsers", {
      sender: userId,
      receiver: userData._id,
    });
  };
  const moreOptions = [
    userData?.friends?.includes(selectedRecipientId)
      ? {
        label: <Typography className=" w-full text-center justify-center flex gap-1"><CancelIcon />Remove</Typography>,
        action: () => setCustomPrompt(true),
      }
      : userData?.pendingRequests?.includes(selectedRecipientId)
        ? {
          label: <Typography className=" w-full text-center justify-center flex gap-1"><HistoryToggleOffIcon />Requested</Typography>,
          action: () => {
            console.log("Already Pending Request");
          },
        }
        : userData?.friendRequests?.includes(selectedRecipientId)
          ? {
            label: <Typography className=" w-full text-center justify-center flex gap-1"><DoneIcon />Accept</Typography>,
            action: () => acceptRequestFromUsers(selectedRecipientId),
          }
          : {
            label: <Typography className=" w-full text-center justify-center flex gap-1"><PersonAddIcon />Add Friend</Typography>,
            action: () => sendRequest(selectedRecipientId, userData._id),
          },
  ];

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
        <MoreOptions options={moreOptions} />

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
      {customPrompt && (
        <CustomPrompt
          option1="Cancel"
          action1={() => setCustomPrompt(false)}
          action2={() => {
            removeFriend(selectedRecipientId, userData._id);
            setCustomPrompt(false);
          }}
          dialogContent={null}
          open={customPrompt}
          onClose={() => setCustomPrompt(false)}
          option2="Unfriend"
          dialogTitle="Sure, want to Unfriend?"
        />
      )}

    </div>
  );
}

export default UserProfile;
