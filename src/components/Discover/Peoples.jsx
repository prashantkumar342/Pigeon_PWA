import { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Divider, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPeoples, setIsChatBox, setChatBoxData } from '../../redux/slices/global/globalSlice';
import { fetchUsers } from '../../redux/slices/api/fetchUsersSlice';
import { setUsers } from '../../redux/slices/api/fetchUsersSlice';
import ListLoader from '../Loaders/ListLoader';
import { fetchRecipient } from "../../redux/slices/api/recipientSlice"

function Peoples() {
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
    dispatch(fetchRecipient(recipientId))
      .then(response => {
        const user = response.payload
        dispatch(setChatBoxData({ username: user.username, status: user.status, avatar: user.avatar, id: user._id}))
      })
  }
  return (
    <div className="flex flex-col h-full ">
      {/* Search Bar */}
      <div className="p-2 bg-gray-100 flex items-center">
        <TextField
          variant="outlined"
          placeholder="Search people..."
          size="small"
          fullWidth
          slotProps={{ style: { borderRadius: '8px' } }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton onClick={clearSearch} sx={{ ml: 1.5, backgroundColor: "white" }}
          onClickCapture={() => { dispatch(setIsPeoples(false)); dispatch(setUsers([])) }}
        >
          <CloseIcon sx={{ color: '#6E00FF', fontWeight: 500 }} />
        </IconButton>
      </div>
      <Divider />
      {error && <p>Error: {error}</p>}
      {users.length > 0 && (
        <div className="flex-grow overflow-auto ">
          {
            fetchLoading ? <ListLoader /> :
              <List>
                {users.map((user, index) => (
                  <div key={user._id}>
                    <ListItem
                      component={Button}
                      sx={{ textTransform: "none", color: 'black' }}
                      onClick={() => {
                        handleClick(user._id);
                        dispatch(setUsers([]))
                        dispatch(setIsChatBox(true));
                        dispatch(setIsPeoples(false));
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary={user.email}
                      />
                    </ListItem>
                    {index < users.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
          }
        </div>
      )}

    </div>
  );
}

export default Peoples;
