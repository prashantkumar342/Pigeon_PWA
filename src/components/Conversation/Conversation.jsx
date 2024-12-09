import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Divider, Button, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { setIsChatBox, setChatBoxData, setSelectedRecipientId, setMessages, updateConversation, addConversation, setConversations, setRecipient } from '../../redux/slices/global/globalSlice';
import { fetchConversation } from '../../redux/slices/api/conversationSlice';
import { fetchRecipient } from '../../redux/slices/api/recipientSlice';
import { fetchMessages } from '../../redux/slices/api/messagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../socket/socket';
import ListLoader from '../Loaders/ListLoader';
import { useNavigate } from 'react-router-dom';

function ConversationList() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();
  const { status: conversationStatus } = useSelector(state => state.conversation);
  const { conversations } = useSelector(state => state.globalVar);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    dispatch(fetchConversation())
      .then(response => {
        const conversationData = response.payload;
        dispatch(setConversations(conversationData)); // Set fetched conversations
        setFilteredConversations(conversationData); // Initialize filtered conversations
      });
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const result = conversations.filter(convo =>
        convo.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(result);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  useEffect(() => {
    if (socket) {
      socket.on("updateConversation", data => {
        const conversationExists = conversations.find(convo => convo._id === data._id);
        if (conversationExists) {
          dispatch(updateConversation(data));
        } else {
          dispatch(addConversation(data));
        }

        setFilteredConversations(prevFilteredConversations => {
          const exists = prevFilteredConversations.find(convo => convo._id === data._id);
          if (exists) {
            return prevFilteredConversations.map(convo => convo._id === data._id ? data : convo).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          } else {
            return [data, ...prevFilteredConversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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

  const handleClick = async (recipientId) => {
    await dispatch(setSelectedRecipientId(recipientId));
    dispatch(fetchRecipient(recipientId))
      .then(response => {
        const user = response.payload;
        dispatch(setChatBoxData({ username: user.username, status: user.status, avatar: user.avatar, id: user._id }));

        dispatch(setIsChatBox(true));
        navigate(`/dashboard/chat/${recipientId}`);
      });
    dispatch(fetchMessages())
      .then(response => {
        const { responseStatus, messages } = response.payload;
        if (responseStatus === 200) {
          dispatch(setMessages(messages));
        }

      });
  };

  const getRecipient = async (recipientId) => {
    dispatch(setMessages([]))
    await dispatch(setSelectedRecipientId(recipientId))
    dispatch(fetchRecipient(recipientId))
      .then(response => {
        const user = response.payload;
        dispatch(setChatBoxData({ username: user.username, status: user.status, avatar: user.avatar, id: user._id }));
        dispatch(setRecipient(user));
        navigate(`/dashboard/chat/user`);
      });
  }

  return (
    <div className="flex flex-col h-full max-sm:w-screen overflow-y-auto border-gray border-r-2">
      <div className="p-2 bg-gray-100 h-16 border flex items-center justify-center">
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            style: {
              borderRadius: "20px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </div>

      <Divider />

      <div className="overflow-auto px-2">
        {
          conversationStatus === "loading" ? <ListLoader /> :
            <List>
              {filteredConversations.map((convo, index) => (
                <div key={convo._id}>
                  <ListItem
                    component={Button}
                    sx={{
                      textTransform: "none",
                      color: "black",
                      outline: "2px solid transparent",
                      borderRadius: "8px",
                      background: "#e7c8f7",
                      marginBottom: "8px",
                      position: 'relative',
                    }}
                    onClick={(e) => { e.stopPropagation(); handleClick(convo.user._id) }}
                  >
                    <ListItemAvatar
                      onClick={(e) => { e.stopPropagation(); getRecipient(convo.user._id) }}
                    >
                      <Avatar
                        src={convo.user.avatar}
                        sx={{
                          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)"
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={convo.user.username}
                      secondary={convo.lastMessage?.content || ''}
                      sx={{
                        marginLeft: "16px",
                        '& .MuiListItemText-primary': {
                          fontWeight: 'bold',
                          color: 'black',
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'black',
                        }
                      }}
                    />
                  </ListItem>
                  {index < filteredConversations.length - 1 && <Divider sx={{ my: 1 }} />}
                </div>
              ))}
            </List>
        }
      </div>
    </div>
  );
}

export default ConversationList;
