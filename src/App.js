import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { useAuthContext } from "./hooks/useAuthContext"

// Styles
import "./App.css"

// Pages/Components
import Dashboard from "./pages/dashboard/Dashboard"
import Signup from "./pages/signup/Signup"
import Login from "./pages/login/Login"
import Project from "./pages/project/Project"
import Create from "./pages/create/Create"

import Navbar from "./components/navbar/Navbar"
import Sidebar from "./components/sidebar/Sidebar"
import OnlineUsers from "./components/online-user/OnlineUsers"

function App() {
  const { user, authIsReady } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        {user && <Sidebar />}
        {authIsReady && (
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/create"
                element={user ? <Create /> : <Navigate to="/login" />}
              />
              <Route
                path="/projects/:id"
                element={user ? <Project /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/signup"
                element={user ? <Navigate to="/" /> : <Signup />}
              />
            </Routes>
          </div>
        )}
        {user && <OnlineUsers />}
      </BrowserRouter>
    </div>
  )
}

export default App
