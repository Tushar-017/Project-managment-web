import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import { v4 as uuidv4 } from "uuid"
import moment from "moment"
import { useState } from "react"
import Avatar from "../../components/avatar/Avatar"

function ProjectComments({ project }) {
  // console.log(project)
  const [newComment, setNewComment] = useState("")
  const { user } = useAuthContext()
  const { updateDocument, response } = useFirestore("projects")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
      id: uuidv4(),
    }

    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    })
    if (!response.error) {
      setNewComment("")
    }
  }

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>

      <ul>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-author">
                <Avatar src={comment.photoURL} />
                <p>{comment.displayName}</p>
              </div>
              <div className="comment-date">
                <p style={{ fontSize: "0.7rem" }}>{comment.createdAt}</p>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
            </li>
          ))}
      </ul>
      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button className="btn">Add Comment</button>
      </form>
    </div>
  )
}

export default ProjectComments
