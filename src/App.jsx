import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Form from "./components/Forms/Form"
import Dashboard from "./components/Dashboard/Dashboard"

//slices
import { authenticateUser } from "./redux/slices/api/authenticateSlice"
import { useEffect } from "react";
import ScreenLoader from "./components/Loaders/ScreenLoader";

function App() {
  const dispatch = useDispatch();
  const { authLoading } = useSelector(state => state.authenticateUser)
  const { isLoggedIn } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(authenticateUser())
  }, [dispatch])


  return (
    <div>

      <Routes>
        <Route path="/" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Navigate to="/dashboard" /> : <Form />)} />
        <Route path="/dashboard" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Dashboard /> : <Navigate to="/" />)} />
        <Route path="*" element={authLoading ? <ScreenLoader /> : (isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/" />)} />
      </Routes>

    </div>
  )
}

export default App