import Navbar from "./components/Navbar"
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import { useEffect } from "react";
import {Loader} from "lucide-react"
import { useAuthStore } from "./stores/authStore";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./stores/themeStore";




const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const {theme} = useThemeStore();

  console.log({onlineUsers})

  useEffect(() => {
    checkAuth();

  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
     </div>
    )

  return (
    <div data-theme={theme}>
      <Navbar />
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage />: <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/settings" element={authUser ? <SettingsPage />: <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUpPage/>}/>

      </Routes>

      <Toaster />

    </div>
  )
}

export default App