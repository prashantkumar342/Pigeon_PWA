import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Divider, Button, Box, IconButton, Typography, InputAdornment } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPeoples, setChatBoxData, setMessages, setSelectedConversationId } from '../../redux/slices/global/globalSlice';
import { fetchUsers } from '../../redux/slices/api/fetchUsersSlice';
import { setUsers } from '../../redux/slices/api/fetchUsersSlice';
import ListLoader from '../Loaders/ListLoader';
import { fetchRecipient } from "../../redux/slices/api/recipientSlice"
import { fetchMessages } from '../../redux/slices/api/messagesSlice';
import { useNavigate } from 'react-router-dom';

function Peoples() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchLoading, users, error } = useSelector(state => state.users);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchUsers(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const clearSearch = () => {
    setSearchQuery('');
  };
  const handleClick = (recipientId) => {
    dispatch(setSelectedConversationId(recipientId));
    dispatch(fetchRecipient(recipientId))
      .then(response => {
        const user = response.payload
        dispatch(setChatBoxData({ username: user.username, status: user.status, avatar: user.avatar, id: user._id }))
      })
    dispatch(fetchMessages())
      .then(response => {
        const messages = response.payload;
        dispatch(setMessages(messages));
      });
    navigate("/dashboard/chat/user")
  }
  return (
    <div className="flex flex-col h-full max-sm:w-screen overflow-y-auto border-gray border-r-2">
      <Box sx={{ p: 2, bg: 'gray.100', borderBottom: '1px solid #ccc' }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          fullWidth
          slotProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    clearSearch();
                    dispatch(setUsers([]))
                  }
                  }
                >
                  <CloseIcon sx={{ color: "#6E00FF" }} />
                </IconButton>
              </InputAdornment>
            ),
            style: {
              borderRadius: "20px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              paddingRight: '10px',
            },
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: "black" }}>Peoples</Typography>
      </Box>
      {error && <p>Error: {error}</p>}
      {users.length > 0 && (
        <div className="overflow-auto px-2 flex-grow">
          {fetchLoading ? (
            <ListLoader />
          ) : (
            <List>
              {users.map((user, index) => (
                <div key={user._id}>
                  <ListItem
                    component={Button}
                    sx={{
                      textTransform: "none",
                      color: "black",
                      outline: "2px solid transparent",
                      borderRadius: "8px",
                      background: "#AD49E1",
                      marginBottom: "8px",
                    }}
                    onClick={() => {
                      handleClick(user._id);
                      dispatch(setUsers([]));
                      dispatch(setIsPeoples(false));
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={user.avatar}
                        sx={{
                          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.username}
                      secondary={user.email}
                      sx={{
                        marginLeft: "16px",
                        "& .MuiListItemText-primary": {
                          fontWeight: "bold",
                          color: "white",
                        },
                        "& .MuiListItemText-secondary": {
                          color: "white",
                        },
                      }}
                    />
                  </ListItem>
                  {index < users.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}
        </div>
      )}
    </div>

  );
}

export default Peoples;
