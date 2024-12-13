import { useMediaQuery, useTheme, Typography } from "@mui/material";
import ChatBox from "../Chatbox/ChatBox";
import UserProfile from "../UserProfile/UserProfile";
import Sidebar from "../Navigation/SideBar";
import NavDrawer from "../Navigation/NavDrawer";
import { useLocation, useNavigate } from "react-router-dom";
import Chats from "../Conversation/Conversation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { selectedRecipientId } = useSelector((state) => state.globalVar);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const conversationId = query.get("conversationId");

  const isUserProfileRoute = location.pathname.includes("user");

  useEffect(() => {
    if (location.pathname.includes("chat") && !isUserProfileRoute) {
      if (!conversationId || conversationId !== selectedRecipientId) {
        navigate("/dashboard/chat");
      }
    }
  }, [
    location.pathname,
    conversationId,
    selectedRecipientId,
    isUserProfileRoute,
    navigate,
  ]);

  const isChatRoute = conversationId && conversationId === selectedRecipientId;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex flex-row flex-grow h-full overflow-hidden">
        {isSmallScreen ? <NavDrawer /> : <Sidebar />}
        <div className="flex-grow flex flex-col h-full">
          <div className="flex max-sm:flex-col flex-grow overflow-hidden">
            <div className="flex-none w-[300px] max-w-[350px] max-sm:w-full">
              <Chats />
            </div>
            <div className="flex-grow max-sm:w-full">
              {isChatRoute ? (
                <ChatBox />
              ) : isUserProfileRoute ? (
                <UserProfile />
              ) : (
                <div className="flex h-full w-full items-center justify-center max-sm:hidden">
                  <Typography variant="body1">
                    There is no chat selected
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
