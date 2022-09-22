import { BrowserRouter, Route, Routes } from "react-router-dom"

// Styles
import "./App.css"

// Pages/Components
import Dashboard from "./pages/dashboard/Dashboard"
import Signup from "./pages/signup/Signup"
import Login from "./pages/login/Login"
import Project from "./pages/project/Project"
import Create from "./pages/create/Create"

import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <div className="container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<Create />} />
            <Route path="/projects/:id" element={<Project />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
