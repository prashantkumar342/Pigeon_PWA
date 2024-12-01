import { Avatar, Divider, IconButton } from "@mui/material";
import { Chat, Logout, Search } from "@mui/icons-material";
import { setIsPeoples } from "../../redux/slices/global/globalSlice";
import { logoutUser } from "../../redux/slices/api/logoutSlice"
import { setUserData, setLoggedIn } from "../../redux/slices/global/userSlice"
import { authenticateUser } from "../../redux/slices/api/authenticateSlice"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user)


  const logout = () => {
    dispatch(logoutUser())
      .then(response => {
        const status = response.payload
        if (status === 200) {
          dispatch(setUserData(null))
          dispatch(setLoggedIn(false))
          dispatch(authenticateUser())
          navigate('/')
        }
      })
  }

  return (
    <div className="flex flex-col items-center h-full bg-[#6E00FF] border-r-2 p-4 box-border">
      <div className="flex justify-center py-4">
        <Avatar sx={{ width: "50px", height: "50px", outline: "solid black" }} src={userData.avatar} />
      </div>
      <Divider className="bg-white w-full" />
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="flex flex-col gap-6">
          <IconButton sx={{ color: "white", fontSize: '25px' }}>
            <Chat fontSize="inherit" />
          </IconButton>
          <IconButton sx={{ color: "white", fontSize: '25px' }}
            onClick={() => { dispatch(setIsPeoples(true)) }}
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
