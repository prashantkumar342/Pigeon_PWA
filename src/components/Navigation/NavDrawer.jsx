
import { Avatar, Button, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Chat, Logout, Search } from "@mui/icons-material";
import { setIsDrawer } from "../../redux/slices/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/api/logoutSlice"
import { setUserData, setLoggedIn, } from "../../redux/slices/global/userSlice"
import { authenticateUser } from "../../redux/slices/api/authenticateSlice"
import { Link, useNavigate } from "react-router-dom";


function NavDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDrawer } = useSelector(state => state.globalVar);
  const { userData } = useSelector(state => state.user)
  const logout = () => {
    dispatch(logoutUser())
      .then(response => {
        const status = response.payload
        if (status === 200) {
          dispatch(authenticateUser())
          dispatch(setUserData(null))
          dispatch(setLoggedIn(false))
          navigate('/')
        }
      })
  }
  return (
    <Drawer
      open={isDrawer}
      onClose={() => dispatch(setIsDrawer(false))}
      sx={{
        '& .MuiDrawer-paper': {
          width: "230px",
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          padding: '10px',
          background: 'transparent',
          backdropFilter: 'blur(5px)'
        },
      }}
    >
      <div className='w-full justify-center flex'>
        <Avatar sx={{ width: "70px", height: "70px" }} src={userData.avatar} />
      </div>
      <Divider />
      <div className='w-full flex justify-center h-full items-center'>
        <List>

          <ListItem sx={{
            cursor: "pointer",
          }}
            component={Link}
            to="/dashboard/chat"
            onClick={() => { dispatch(setIsDrawer(false)) }}
          >
            <ListItemIcon sx={{
              color: location.pathname === "/dashboard/chat" ? "white" : "dark",
            }}><Chat /></ListItemIcon>
            <ListItemText primary="Chats" sx={{
              color: location.pathname === "/dashboard/chat" ? "white" : "dark",
            }} />
          </ListItem>

          <Divider sx={{ backgroundColor: "white" }} />

          <ListItem sx={{
            cursor: "pointer",
          }}
            component={Link}
            to="/dashboard/find"
            onClick={() => { dispatch(setIsDrawer(false)) }}
          >
            <ListItemIcon sx={{
              color: location.pathname === "/dashboard/find" ? "white" : "dark",
            }}><Search /></ListItemIcon>
            <ListItemText primary="Search" sx={{
              color: location.pathname === "/dashboard/find" ? "white" : "dark",
            }} />
          </ListItem>
        </List>
      </div>
      <div className='w-full flex justify-center mt-auto'>
        <Button startIcon={<Logout />} sx={{ textTransform: "none", color: "white", fontSize: "15px" }}
          onClick={logout}
        >Logout</Button>
      </div>
    </Drawer>
  );
}

export default NavDrawer;
