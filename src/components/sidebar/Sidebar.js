import { NavLink } from "react-router-dom"
import Avatar from "../avatar/Avatar"
import { useAuthContext } from "../../hooks/useAuthContext"

// Styles & images
import "./Sidebar.css"
import DashboardIcon from "../../assets/dashboard_icon.svg"
import AddIcon from "../../assets/add_icon.svg"

function Sidebar() {
  const { user } = useAuthContext()
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL} />
          {/* avatar and user name here */}
          <p>Hey, {user.displayName} 👋</p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink end to="/">
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <img src={AddIcon} alt="add project icon" />
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
