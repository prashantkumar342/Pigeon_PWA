import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./components/Forms/Form";
import Dashboard from "./components/Dashboard/Dashboard";
import Chats from "./components/Conversation/Conversation";
import UserProfile from "./components/UserProfile/UserProfile";
//slices
import { authenticateUser } from "./redux/slices/api/authenticateSlice";
import { useEffect, useState } from "react";
import ScreenLoader from "./components/Loaders/ScreenLoader";
import SplashScreen from "./splashScreen/SplashScreen";
// import MyProfile from "./components/UserProfile/MyProfile";
import Settings from "./components/UserProfile/Settings";

function App() {
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.authenticateUser);
  const { isLoggedIn } = useSelector((state) => state.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticateUser());
  }, [dispatch]);

  useEffect(() => {
    const handleDOMLoaded = () => {
      setIsLoaded(true);
    };
    document.addEventListener("DOMContentLoaded", handleDOMLoaded);
    return () => {
      document.removeEventListener("DOMContentLoaded", handleDOMLoaded);
    };
  }, []);

  return (
    <div>
      {!isLoaded && <SplashScreen />}{" "}
      <Routes>
        {" "}
        <Route
          path="/"
          element={
            authLoading ? (
              <ScreenLoader />
            ) : isLoggedIn ? (
              <Navigate to="/dashboard/chat" />
            ) : (
              <Form />
            )
          }
        />{" "}
        <Route
          path="/dashboard"
          element={
            authLoading ? (
              <ScreenLoader />
            ) : isLoggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          {" "}
          <Route path="chat" element={<Chats />}>
            {" "}
            <Route path="user" element={<UserProfile />} />
            <Route path="settings" element={<Settings />} />{" "}
            {/* <Route path="*" element={<Navigate to="/dashboard/chat/settings" />} />{" "} */}
          </Route>{" "}
        </Route>{" "}
        <Route
          path="*"
          element={
            isLoggedIn ? <Navigate to="/dashboard/chat" /> : <Navigate to="/" />
          }
        />{" "}
      </Routes>
    </div>
  );
}

export default App;
