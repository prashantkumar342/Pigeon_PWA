import { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Typography,
  ButtonGroup,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  fetchRequests,
  addRequest,
  removeRequest,
} from "../../redux/slices/api/fetchRequestSlice";
import { fetchFriends } from "../../redux/slices/api/fetchFriendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { primaryColor } from "../../styles/Var";
import { useSocket } from "../../socket/socket";

function RequestList() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.requests); // Ensure this matches your Redux store

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on("newFriendRequest", (data) => {
        dispatch(addRequest(data));
      });
      socket.on("friendRequestAccepted", (reqId) => {
        console.log("friendRequestAccepted", reqId);
        dispatch(removeRequest(reqId));
      });
      socket.on("friendRequestDeclined", (reqId) => {
        console.log("friendRequestDeclined", reqId);
        dispatch(removeRequest(reqId));
      });
    }

    return () => {
      if (socket) {
        socket.off("newFriendRequest");
        socket.off("friendRequestAccepted");
        socket.off("friendRequestDeclined");
      }
    };
  }, [socket, dispatch]);

  const acceptRequest = (reqId) => {
    socket.emit("acceptRequest", reqId);
    dispatch(fetchFriends());
  };
  const declineRequest = (reqId) => {
    socket.emit("declineRequest", reqId);
  };

  return (
    <div className="flex flex-col h-full max-sm:w-screen overflow-y-auto px-1">
      <Accordion
        sx={{ border: "gray 1px solid", marginTop: 0, borderRadius: 4 }}
        disableGutters
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ backgroundColor: primaryColor }}
        >
          <Typography className="text-white">Friend Requests</Typography>{" "}
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <div className="overflow-y-auto no-scrollbar h-full px-2">
            {requests.length === 0 ? (
              <Typography className=" p-2 text-center">
                Request list empty
              </Typography>
            ) : (
              <List>
                {requests.map((request, index) => (
                  <div key={request._id}>
                    <ListItem
                      sx={{
                        textTransform: "none",
                        color: "black",
                        outline: "none",
                        borderRadius: "0px",
                        paddingRight: 0,
                        marginBottom: "0px",
                        position: "relative",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={
                            request?.requester?.avatar || "/default-avatar.png"
                          }
                          sx={{ boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)" }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={request?.requester?.username || "Unknown"}
                        secondary={`${
                          request?.requester?.email?.slice(0, 10) || ""
                        }...`}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontWeight: "bold",
                            color: "black",
                          },
                          "& .MuiListItemText-secondary": { color: "black" },
                        }}
                      />
                      <Box>
                        <ButtonGroup>
                          <IconButton
                            sx={{
                              outline: "none",
                              padding: "4px",
                              borderRadius: "50%",
                              marginX: 0.5,
                              color: primaryColor,
                            }}
                            onClick={() => acceptRequest(request._id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            sx={{
                              outline: "none",
                              padding: "4px",
                              borderRadius: "50%",
                              marginX: 0.5,
                              color: "gray",
                            }}
                            onClick={() => declineRequest(request._id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </ButtonGroup>
                      </Box>
                    </ListItem>
                    {index < requests.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default RequestList;
