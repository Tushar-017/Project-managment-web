import { useCollection } from "../../hooks/useCollection"

// Styles/components
import "./OnlineUsers.css"
import Avatar from "../avatar/Avatar"

function OnlineUsers() {
  const { error, documents } = useCollection("users")
  return (
    <div className="user-list">
      <h2>All users</h2>
      {error && <div className="error">{error}</div>}
      {documents &&
        documents.map((user) => (
          <div key={user.id} className="user-list-item">
            {user.online && <span className="online-user"></span>}
            <span>{user.displayName}</span>
            <Avatar src={user.photoURL} />
          </div>
        ))}
    </div>
  )
}

export default OnlineUsers
