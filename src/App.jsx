import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./components/Forms/Form";
import Dashboard from "./components/Dashboard/Dashboard";
import ConversationList from "./components/Conversation/Conversation";
import Peoples from "./components/Discover/Peoples";
import ChatBox from "./components/Chatbox/ChatBox";
import UserProfile from "./components/UserProfile/UserProfile";
//slices
import { authenticateUser } from "./redux/slices/api/authenticateSlice";
import { useEffect, useState } from "react";
import ScreenLoader from "./components/Loaders/ScreenLoader";
import SplashScreen from "./splashScreen/SplashScreen";

function App() {
  const dispatch = useDispatch();
  const { authLoading } = useSelector(state => state.authenticateUser);
  const { isLoggedIn } = useSelector(state => state.user);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticateUser());
  }, [dispatch]);
  useEffect(() => { const handleDOMLoaded = () => { setIsLoaded(true); }; document.addEventListener('DOMContentLoaded', handleDOMLoaded); return () => { document.removeEventListener('DOMContentLoaded', handleDOMLoaded); }; }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Navigate to="/dashboard/chat" /> : <Form />)} />
        <Route path="/dashboard" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Dashboard /> : <Navigate to="/" />)}>
          <Route index element={<ConversationList />} />
          <Route path="chat" element={<ConversationList />}>
            <Route path=":conversationId" element={<ChatBox />} />
            <Route path="user" element={<UserProfile/>} />
          </Route>
          <Route path="find" element={<Peoples />} />
        </Route>
        
      </Routes>
      {!isLoaded && <SplashScreen />}
    </div>
  );
}

export default App;
