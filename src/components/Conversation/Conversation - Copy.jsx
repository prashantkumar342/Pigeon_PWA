import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Divider, Button } from "@mui/material";
import { setIsChatBox, setChatBoxData, setSelectedConversationId, setMessages } from '../../redux/slices/global/globalSlice';
import { fetchConversation } from '../../redux/slices/api/conversationSlice';
import { fetchRecipient } from "../../redux/slices/api/recipientSlice";
import { fetchMessages } from '../../redux/slices/api/messagesSlice';
import { useDispatch, useSelector } from 'react-redux';

function ConversationList() {
  const dispatch = useDispatch();
  const { conversations } = useSelector(state => state.globalVar);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    dispatch(fetchConversation())
      .then(response => {
        const conversationData = response.payload;
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

  const handleClick = (recipientId, chatId) => {
    dispatch(setSelectedConversationId(chatId));
    dispatch(fetchRecipient(recipientId))
      .then(response => {
        const user = response.payload;
        dispatch(setChatBoxData({ username: user.username, status: user.status, avatar: user.avatar, id: user._id }));
        dispatch(setIsChatBox(true));
      });
    dispatch(fetchMessages())
      .then(response => {
        const messages = response.payload;
        dispatch(setMessages(messages));

      })
  };

  return (
    <div className="flex flex-col h-full max-sm:w-screen overflow-y-auto border-r-2 border-white">
      <div className="p-2 bg-gray-100 h-16">
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ borderRadius: "8px" }}
        />
      </div>
      <Divider />
      <div className="flex-grow overflow-auto">
        <List>
          {filteredConversations.map((convo) => (
            <div key={convo._id}>
              <ListItem
                component={Button}
                sx={{ textTransform: "none", color: "black" }}
                onClick={() => handleClick(convo.user._id, convo._id)}
              >
                <ListItemAvatar>
                  <Avatar src={convo.user.avatar} sx={{ outline: "solid gray" }} />
                </ListItemAvatar>
                <ListItemText
                  primary={convo.user.username}
                  secondary={convo.lastMessage?.content || ''}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    </div>
  );
}

export default ConversationList;
