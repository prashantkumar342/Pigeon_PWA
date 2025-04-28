import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Divider,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import {
  setIsChatBox,
  setChatBoxData,
  setSelectedRecipientId,
  setMessages,
  updateConversation,
  addConversation,
  setConversations,
  setRecipient,
} from "../../redux/slices/global/globalSlice";
import { fetchConversation } from "../../redux/slices/api/conversationSlice";
import { fetchRecipient } from "../../redux/slices/api/recipientSlice";
import { fetchMessages } from "../../redux/slices/api/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../socket/socket";
import ListLoader from "../Loaders/ListLoader";
import { useNavigate } from "react-router-dom";
import CustomContextMenu from "../Menus/ContextMenu";
import DataLoader from "../Loaders/DataLoader";

function ConversationList() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();
  const { status: conversationStatus } = useSelector(
    (state) => state.conversation
  );
  const { conversations = [] } = useSelector((state) => state.globalVar);

  const { recipientLoading } = useSelector((state) => state.recipient)
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [menuPosition, setMenuPosition] = useState(null);
  const [contextOptions, setContextOptions] = useState([]);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const { clientX: x, clientY: y } = event;
    setMenuPosition({ x, y });
    setContextOptions([
      { label: "this feature", onClick: () => null },
      { label: "comming soon", onClick: () => null },
    ]);
  };
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setTimeout(() => {
      setMenuPosition({ x: touch.clientX, y: touch.clientY });
      setContextOptions([
        { label: "this feature", onClick: () => null },
        { label: "comming soon", onClick: () => null },
      ]);
    }, 500);
  };
  const handleClose = () => {
    setMenuPosition(null);
  };

  useEffect(() => {
    const handleClick = () => {
      if (!menuPosition) return;
      handleClose();
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [menuPosition]);


  useEffect(() => {
    dispatch(fetchConversation()).then((response) => {
      const conversationData = response.payload || [];
      dispatch(setConversations(conversationData));
      setFilteredConversations(conversationData);
    });
  }, [dispatch]);


  useEffect(() => {
    if (searchQuery) {
      const result = (conversations || []).filter((convo) =>
        convo.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(result);
    } else {
      setFilteredConversations(conversations || []);
    }
  }, [searchQuery, conversations]);


  useEffect(() => {
    if (socket) {
      socket.on("updateConversation", (data) => {
        const conversationExists = conversations.find(
          (convo) => convo._id === data._id
        );
        if (conversationExists) {
          dispatch(updateConversation(data));
        } else {
          dispatch(addConversation(data));
        }

        setFilteredConversations((prevFilteredConversations) => {
          const exists = prevFilteredConversations.find(
            (convo) => convo._id === data._id
          );
          if (exists) {
            return prevFilteredConversations
              .map((convo) => (convo._id === data._id ? data : convo))
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          } else {
            return [data, ...prevFilteredConversations].sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
          }
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("updateConversation");
      }
    };
  }, [socket, dispatch, conversations]);

  const handleSearchIconClick = () => {
    if (isSearchVisible) {
      setSearchQuery("");
      setFilteredConversations(conversations);
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const handleClick = async (recipientId) => {
    await dispatch(setSelectedRecipientId(recipientId));
    dispatch(fetchRecipient(recipientId)).then((response) => {
      const user = response.payload;
      dispatch(
        setChatBoxData({
          username: user.username,
          status: user.status,
          avatar: user.avatar,
          id: user._id,
        })
      );

      dispatch(setIsChatBox(true));
      navigate(`/dashboard/chat?conversationId=${recipientId}`);
    });
    dispatch(fetchMessages()).then((response) => {
      const { responseStatus, messages } = response.payload;
      if (responseStatus === 200) {
        dispatch(setMessages(messages));
      }
    });
  };

  const getRecipient = async (recipientId) => {
    dispatch(setMessages([]));
    await dispatch(setSelectedRecipientId(recipientId));
    dispatch(fetchRecipient(recipientId)).then((response) => {
      const user = response.payload;
      dispatch(
        setChatBoxData({
          username: user.username,
          status: user.status,
          avatar: user.avatar,
          id: user._id,
        })
      );
      dispatch(setRecipient(user));
      navigate(`/dashboard/chat/user`);
    });
  };

  return (
    <div className="flex flex-col  h-full max-sm:w-screen overflow-y-auto">
      <Box sx={{ px: 1, pb: 1 }}>
        <TextField
          variant="outlined"
          placeholder="Search Chats"
          size="medium"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearchIconClick}>
                  <CloseIcon sx={{ color: "#6E00FF" }} />
                </IconButton>
              </InputAdornment>
            ),
            style: {
              borderRadius: "15px",
              paddingRight: "10px",
            },
          }}
        />
      </Box>
      <div className="overflow-y-auto no-scrollbar  h-full px-2">
        {conversationStatus === "loading" ? (
          <ListLoader />
        ) : (
          <List>
            {(filteredConversations || []).map((convo, index) => (

              <div key={convo._id}>
                <ListItem
                  component={Button}
                  sx={{
                    textTransform: "none",
                    color: "black",
                    outline: "none",
                    borderRadius: "0px",
                    marginBottom: "0px",
                    position: "relative",
                    paddingY: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(convo.user._id);
                  }}
                  onContextMenu={handleContextMenu}
                  onTouchStart={handleTouchStart}
                >

                  <ListItemAvatar
                    onClick={(e) => {
                      e.stopPropagation();
                      getRecipient(convo.user._id);
                    }}
                  >
                    <Avatar
                      src={convo.user.avatar}
                      sx={{ boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={convo.user.username}
                    secondary={
                      convo.lastMessage?.type === "image" ? (
                        <span>

                          <ImageIcon
                            style={{
                              verticalAlign: "middle",
                              marginRight: "4px",
                              fontSize: "16px",
                              color: "gray",
                            }}
                          />
                          photo
                        </span>
                      ) : convo.lastMessage?.type === "video" ? (
                        <span>

                          <VideoLibraryIcon
                            style={{
                              verticalAlign: "middle",
                              marginRight: "4px",
                              fontSize: "16px",
                              color: "gray",
                            }}
                          />
                          video
                        </span>
                      ) : (
                        convo.lastMessage?.content.length > 9 ? convo.lastMessage?.content.slice(0, 10) + ' ...' : convo.lastMessage?.content.slice(0, 10)
                      )
                    }
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: "bold",
                        color: "black",
                      },
                      "& .MuiListItemText-secondary": { color: "black" },
                    }}
                  />
                </ListItem>
                {index < filteredConversations.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        )}
        <CustomContextMenu
          menuPosition={menuPosition}
          options={contextOptions}
          onClose={handleClose}
        />
      </div>
      {
        recipientLoading && <DataLoader />
      }
    </div>
  );
}

export default ConversationList;
