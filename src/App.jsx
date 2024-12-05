import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./components/Forms/Form";
import Dashboard from "./components/Dashboard/Dashboard";
import ConversationList from "./components/Conversation/Conversation";
import Peoples from "./components/Discover/Peoples";

//slices
import { authenticateUser } from "./redux/slices/api/authenticateSlice";
import { useEffect } from "react";
import ScreenLoader from "./components/Loaders/ScreenLoader";

function App() {
  const dispatch = useDispatch();
  const { authLoading } = useSelector(state => state.authenticateUser);
  const { isLoggedIn } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(authenticateUser());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Navigate to="/dashboard/chat" /> : <Form />)} />
        <Route path="/dashboard" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Dashboard /> : <Navigate to="/" />)}>
          <Route index element={<ConversationList />} />
          <Route path="chat" element={<ConversationList />} />
          <Route path="find" element={<Peoples />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard/chat" />} /> {/* Redirect any unknown routes to the dashboard */}
      </Routes>
    </div>
  );
}

export default App;
