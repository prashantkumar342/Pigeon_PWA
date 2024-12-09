import {
  TextField,
  IconButton,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  updateChatBoxData,
  addLocalMessage,
  replaceLocalMessage,
  revertLocalMessage,
  updateMessages,
  setSelectedRecipientId,
} from "../../redux/slices/global/globalSlice";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../socket/socket";
import BlinkingSkeletonList from "../Loaders/ListItemLoader";
import TypingIndicator from "../Loaders/TypingIndicator";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useNavigate } from "react-router-dom";

function ChatBox() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    chatBoxData = { username: "", status: "", avatar: "", id: "" },
    messages,
    selectedRecipientId,
  } = useSelector((state) => state.globalVar);
  const { userData } = useSelector((state) => state.user);
  const { recipientLoading } = useSelector((state) => state.recipient);
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (data) => {
        if (
          data.receiver === selectedRecipientId ||
          data.sender === selectedRecipientId
        ) {
          dispatch(updateMessages(data));
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      const handleTyping = (data) => {
        if (data.sender === selectedRecipientId) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000); // Clear typing indicator after 3 seconds
        }
      };

      socket.on("typing", handleTyping);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("typing", handleTyping);
      };
    }
  }, [socket, selectedRecipientId, dispatch]);

  const handleBack = () => {
    dispatch(setSelectedRecipientId(null));
    navigate("/dashboard/chat");
  };

  const handleTyping = (e) => {
    setTypedMessage(e.target.value);
    socket.emit("typing", { sender: userData._id, receiver: chatBoxData.id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedMessage.trim()) {
      const tempMessageId = uuidv4();
      const newMessage = {
        _id: tempMessageId,
        tempId: tempMessageId,
        sender: userData._id,
        receiver: chatBoxData.id,
        content: typedMessage,
        conversation: selectedRecipientId,
        status: "pending",
        timestamp: new Date().toISOString(),
      };
      dispatch(addLocalMessage(newMessage));
      scrollToBottom();

      socket.emit("messageFromClient", newMessage, (response) => {
        if (response.status === "ok") {
          // Update the message with the server's response
          dispatch(
            replaceLocalMessage({ ...response.message, tempId: tempMessageId })
          );
        } else {
          // Revert the optimistic update if there was an error
          dispatch(revertLocalMessage(tempMessageId));
        }
      });

      setTypedMessage("");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date)) {
      return "";
    }
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("AM", "am")
      .replace("PM", "pm");
  };

  return (
    <div className="flex-grow max-sm:w-screen h-full overflow-y-auto flex flex-col max-sm:fixed top-0">
      {recipientLoading ? (
        <BlinkingSkeletonList />
      ) : (
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
      )}
      <div className="flex-grow h-1 overflow-auto p-4 space-y-2 bg-white">
        {messages.length ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === userData._id
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`p-2 max-w-xs ${message.sender === userData._id
                    ? "bg-primary rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl text-white"
                    : "bg-gray-200 rounded-b-2xl rounded-tr-2xl text-black"
                  }`}
              >
                {message.content}
                <div
                  className={`text-right text-xs mt-1 ${message.sender === userData._id
                      ? "text-slate-300"
                      : "text-slate-500"
                    }`}
                >
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
        {isTyping && (
          <div className="flex justify-start  w-fit p-1 max-w-xs bg-gray-200 rounded-b-2xl rounded-tr-2xl text-black">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-gray-100 border-t max-sm:border-none border-gray-300 flex items-center">
        <Avatar sx={{ width: 32, height: 32 }} src={userData?.avatar} />
        <form className="flex items-center w-full" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            placeholder="Type a message"
            fullWidth
            onChange={handleTyping}
            value={typedMessage}
            sx={{ ml: 1, flexGrow: 1 }}
            size="small"
          />
          <IconButton color="primary" sx={{ ml: 1 }} type="submit">
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
