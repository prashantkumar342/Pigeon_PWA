import { useMediaQuery, useTheme, AppBar, Toolbar, IconButton, Avatar, Typography } from "@mui/material";
import { setIsDrawer } from "../../redux/slices/global/globalSlice";
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from "../Navigation/SideBar"
import NavDrawer from "../Navigation/NavDrawer";
import Conversation from "../Conversation/Conversation"
import Discover from "../Discover/Discover"
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../Chatbox/ChatBox"
function Dashboard() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isChatBox } = useSelector(state => state.globalVar)
  const { userData } = useSelector(state => state.user)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex flex-row flex-grow h-full overflow-hidden">
        {isSmallScreen ? <NavDrawer /> : <Sidebar />}
        <div className="flex-grow flex flex-col h-full">
          <AppBar position="static" elevation={0} sx={{ backgroundColor: "#6E00FF", height: "50px", justifyContent: 'center' }}>
            <Toolbar className="flex justify-between">
              {!isSmallScreen ? <Typography variant="h5" sx={{ marginLeft: "10px" }}>Chatty</Typography> : null}
              {isSmallScreen && (
                <div className="flex items-center w-full">
                  <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => dispatch(setIsDrawer(true))}>
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h5" sx={{ marginLeft: "10px" }}>C4Chat</Typography>
                  <Avatar sx={{ marginLeft: "auto" }} src={userData.avatar} />
                </div>
              )}
            </Toolbar>
          </AppBar>
          <div className="flex max-sm:flex-col flex-grow overflow-hidden border-green border">
            <Conversation />
            {
              isChatBox ? <ChatBox /> :
                (<><div className="
                    flex h-full w-full items-center justify-center max-sm:hidden
                    "><Typography variant="body1">There is no chat selected </Typography></div></>)
            }

          </div>
        </div>
      </div>
      <Discover />
    </div>
  )
}

export default Dashboard