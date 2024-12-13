import { useState } from "react";
import {
  Avatar,
  Button,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Chat, Logout } from "@mui/icons-material";
import {
  setIsDrawer,
  setCustomPrompt,
} from "../../redux/slices/global/globalSlice";
import { logoutUser } from "../../redux/slices/api/logoutSlice";
import { setUserData, setLoggedIn } from "../../redux/slices/global/userSlice";
import { authenticateUser } from "../../redux/slices/api/authenticateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomPrompt from "../Prompt/CustomPrompt";

function NavDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clearData, setClearData] = useState(false);
  const { isDrawer, customPrompt } = useSelector((state) => state.globalVar);
  const { userData } = useSelector((state) => state.user);

  let chatsParams =
    location.pathname.includes("/dashboard/chat") &&
    !location.pathname.includes("/dashboard/chat/user");

  const handleCheckboxChange = (event) => {
    setClearData(event.target.checked);
  };

  const clearWebsiteData = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("All storage data cleared");
  };

  const logout = () => {
    dispatch(logoutUser()).then((response) => {
      const status = response.payload;
      if (status === 200) {
        if (clearData) {
          clearWebsiteData();
          console.log("Logged out and data is cleared");
        } else {
          console.log("Logged out");
        }
        dispatch(authenticateUser());
        dispatch(setUserData(null));
        dispatch(setLoggedIn(false));
        navigate("/");
      }
    });
  };

  return (
    <Drawer
      open={isDrawer}
      onClose={() => dispatch(setIsDrawer(false))}
      sx={{
        "& .MuiDrawer-paper": {
          width: "230px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          padding: "10px",
          background: "transparent",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <div className="w-full justify-center flex">
        <Avatar sx={{ width: "70px", height: "70px" }} src={userData.avatar} />
      </div>
      <Divider />
      <div className="w-full flex justify-center h-full items-center">
        <List>
          <ListItem
            sx={{
              cursor: "pointer",
            }}
            component={Link}
            to="/dashboard/chat"
            onClick={() => {
              dispatch(setIsDrawer(false));
            }}
          >
            <ListItemIcon
              sx={{
                color: chatsParams ? "white" : "dark",
              }}
            >
              <Chat />
            </ListItemIcon>
            <ListItemText
              primary="Chats"
              sx={{
                color: chatsParams ? "white" : "dark",
              }}
            />
          </ListItem>
          <Divider sx={{ backgroundColor: "white" }} />
        </List>
      </div>
      <div className="w-full flex justify-center mt-auto">
        <Button
          startIcon={<Logout />}
          sx={{ textTransform: "none", color: "white", fontSize: "15px" }}
          onClick={() => dispatch(setCustomPrompt(true))}
        >
          Logout
        </Button>
      </div>
      {customPrompt && (
        <CustomPrompt
          option1="Cancel"
          action1={() => dispatch(setCustomPrompt(false))}
          action2={() => {
            logout();
            dispatch(setCustomPrompt(false));
          }}
          option2="Logout"
          dialogTitle="Are you sure you want to logout?"
          dialogContent={
            <DialogContent>
              <DialogContentText id="dialog-description">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={clearData}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Clear data also"
                />
              </DialogContentText>
            </DialogContent>
          }
        />
      )}
    </Drawer>
  );
}

export default NavDrawer;
