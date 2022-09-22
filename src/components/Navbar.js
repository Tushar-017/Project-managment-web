import { Link } from "react-router-dom"

// Styles & image
import "./Navbar.css"
import Logo from "../assets/temple.svg"

function Navbar() {
  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={Logo} alt="scrum logo" />
          <span>The Scrum</span>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <button className="btn">Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
