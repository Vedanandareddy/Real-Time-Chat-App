import { useEffect } from 'react'
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import Navbar from "./components/Navbar.jsx"
import { useAuthStore } from './store/authStore.js'
import { useThemeStore } from './store/useThemeStore.js';
import { Toaster } from 'react-hot-toast'



import { Routes, Route } from "react-router"
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router'

const ProtectedRoutes = ({ children }) => {
  const { authUser, checkauth, isLoading } = useAuthStore()

  try {
    if (isLoading === false && !authUser) {
      return <Navigate to="/login" />
    }
    return children
  } catch (error) {
    console.log("Error in protected routes")
  }
}


const RedirectAuthenicatedUser = ({ children }) => {
  const { authUser, checkauth, isLoading } = useAuthStore()
  try {

    if (!isLoading && authUser) {
      return <Navigate to="/" />
    }
    return children
  } catch (error) {
    console.log("Error in protected routes")
  }
}



const App = () => {

  const { authUser, checkauth, isLoading, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkauth()
  }, [checkauth])


  if (isLoading === true && !authUser) {
    return <div className='flex justify-center items-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  }


  return (
    <div data-theme={theme} className='min-h-screen'>
      <Navbar />

      {/* shown on every route */}
      <Routes>
        <Route path='/' element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
        <Route path='/login' element={<RedirectAuthenicatedUser ><LoginPage /></RedirectAuthenicatedUser>} />
        <Route path='/signup' element={<RedirectAuthenicatedUser><SignUpPage /></RedirectAuthenicatedUser>} />
        <Route path='/profile' element={<ProtectedRoutes><ProfilePage /></ProtectedRoutes>} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>


      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
