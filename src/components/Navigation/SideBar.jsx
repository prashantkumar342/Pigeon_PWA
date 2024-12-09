import { Avatar, Divider, IconButton } from "@mui/material";
import { Chat, Logout, Search } from "@mui/icons-material";
import { logoutUser } from "../../redux/slices/api/logoutSlice"
import { setUserData, setLoggedIn } from "../../redux/slices/global/userSlice"
import { authenticateUser } from "../../redux/slices/api/authenticateSlice"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
;
function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user)
  const { conversationId } = useParams();
  let chatsParams;
  let findParams

  if (location.pathname === `/dashboard/chat/${conversationId}` || location.pathname === `/dashboard` || location.pathname === `/dashboard/chat` || location.pathname === `/dashboard/chat/user`) {
    chatsParams = true
  } else {
    chatsParams = false
  }
  if (location.pathname === "/dashboard/find") {
    findParams = true
  } else {
    findParams = false
  }

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
    <div className="flex flex-col items-center h-full bg-primary p-4">
      <div className="flex justify-center py-4">
        <Avatar sx={{ width: "50px", height: "50px", outline: "solid black" }} src={userData.avatar} />
      </div>
      <Divider className="bg-white w-full h-1" />
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="flex flex-col gap-6">

          <IconButton sx={{
            fontSize: '25px',
            color: chatsParams ? "white" : "dark",
            borderLeft: chatsParams ? "2px solid white" : "none",
            borderRadius: "0"
          }}
            component={Link}
            to="/dashboard/chat"
          >
            <Chat fontSize="inherit" />
          </IconButton>
          <IconButton sx={{
            fontSize: '25px',
            color: findParams ? "white" : "dark",
            borderLeft: findParams ? "2px solid white" : "none",
            borderRadius: "0"
          }}
            component={Link}
            to="/dashboard/find"
          >
            <Search />
          </IconButton>

        </div>
      </div>
      <div className="pb-4">
        <IconButton sx={{ color: "white", fontSize: "30px" }} onClick={logout}>
          <Logout fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
}

export default Sidebar;
