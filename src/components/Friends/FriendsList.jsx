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
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedRecipientId,
  setMessages,
  setChatBoxData,
  setRecipient,
} from "../../redux/slices/global/globalSlice";
import { fetchRecipient } from "../../redux/slices/api/recipientSlice";
import ListLoader from "../Loaders/ListLoader";
import { useNavigate } from "react-router-dom";
import RequestList from "./RequestList";

function FriendsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { friends, fetchLoading, error } = useSelector(
    (state) => state.friends
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const result = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(result);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchQuery, friends]);

  const handleSearchIconClick = () => {
    setSearchQuery("");
    setFilteredFriends(friends);
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
    <div className="flex flex-col h-full max-sm:w-screen overflow-y-auto">
      <Box sx={{ px: 1, pb: 1 }}>
        <TextField
          variant="outlined"
          placeholder="Search Friends"
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

      {fetchLoading ? (
        <ListLoader />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <List>
          <ListItem
            sx={{
              width: "100%",
              padding: 0,
              margin: 0,
            }}
          >
            <div className=" w-full">
              <RequestList />
            </div>
          </ListItem>
          {filteredFriends.map((friend, index) => (
            <div key={friend._id}>
              <ListItem
                component={Button}
                sx={{
                  textTransform: "none",
                  color: "black",
                  outline: "none",
                  borderRadius: "0px",
                  margin: "0px",
                  position: "relative",
                  paddingY: 2,
                }}
                onClick={() => getRecipient(friend._id)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={friend.avatar}
                    sx={{
                      boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.username}
                  secondary={`${friend.email.slice(0, 10)}...`}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                      color: "black",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "black",
                    },
                  }}
                />
              </ListItem>
              {index < filteredFriends.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      )}
    </div>
  );
}

export default FriendsList;
