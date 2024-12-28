import { useState } from "react";
import {
  Avatar,
  Divider,
  IconButton,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Chat, Logout } from "@mui/icons-material";
import { logoutUser } from "../../redux/slices/api/logoutSlice";
import { setUserData, setLoggedIn } from "../../redux/slices/global/userSlice";
import { authenticateUser } from "../../redux/slices/api/authenticateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomPrompt from "../Prompt/CustomPrompt";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [customPrompt, setCustomPrompt] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [clearData, setClearData] = useState(false); // Track checkbox state
  const { conversationId } = useParams();
  let chatsParams;

  if (
    location.pathname === `/dashboard/chat/${conversationId}` ||
    location.pathname === `/dashboard` ||
    location.pathname === `/dashboard/chat` ||
    location.pathname === `/dashboard/chat/user`
  ) {
    chatsParams = true;
  } else {
    chatsParams = false;
  }

  const handleCheckboxChange = (event) => {
    setClearData(event.target.checked);
  };

  const clearWebsiteData = () => {
    localStorage.clear();
    sessionStorage.clear();
  };

  const logout = () => {
    dispatch(logoutUser()).then((response) => {
      const status = response.payload;
      if (status === 200) {
        if (clearData) {
          clearWebsiteData();
        }
        dispatch(authenticateUser());
        dispatch(setUserData(null));
        dispatch(setLoggedIn(false));
        navigate("/");
      }
    });
  };

  return (
    <div className="flex flex-col items-center h-full bg-primary p-4">
      <div className="flex justify-center py-4">
        <Avatar sx={{ width: "50px", height: "50px" }} src={userData.avatar} />
      </div>
      <Divider className="bg-white w-full h-1" />
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="flex flex-col gap-6">
          <IconButton
            sx={{
              fontSize: "25px",
              color: chatsParams ? "white" : "dark",
              borderLeft: chatsParams ? "2px solid white" : "none",
              borderRadius: "0",
            }}
            component={Link}
            to="/dashboard/chat"
          >
            <Chat fontSize="inherit" />
          </IconButton>
        </div>
      </div>
      <div className="pb-4">
        <IconButton
          sx={{ color: "white", fontSize: "30px" }}
          onClick={() => {
            setCustomPrompt(true);
          }}
        >
          <Logout fontSize="inherit" />
        </IconButton>
        {customPrompt && (
          <CustomPrompt
            option1="Cancel"
            action1={() => setCustomPrompt(false)}
            action2={() => {
              logout();
              setCustomPrompt(false);
            }}
            option2="Logout"
            dialogTitle="Are you sure you want to logout?"
            open={() => {
              setCustomPrompt(true);
            }}
            onClose={() => {
              setCustomPrompt(false);
            }}
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
      </div>
    </div>
  );
}

export default Sidebar;
