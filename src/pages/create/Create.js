import { useEffect, useState } from "react"
import moment from "moment"
import Select from "react-select"
import { useCollection } from "../../hooks/useCollection"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import { useNavigate } from "react-router-dom"

// Styles
import "./Create.css"

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
]

function Create() {
  const navigate = useNavigate()
  const { addDocument, response } = useFirestore("projects")
  const { documents } = useCollection("users")
  const [users, setUsers] = useState([])
  const { user } = useAuthContext()

  // form field values
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("")
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName }
      })
      setUsers(options)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!category) {
      setFormError("Please select a project category")
      return
    }
    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user")
      return
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      }
    })

    // let end = moment(new Date(dueDate))
    // let now = moment(new Date())

    const project = {
      name,
      details,
      category: category.value,
      // dueDate: end.diff(now, "hours"),
      dueDate: moment(new Date(dueDate)).format("MMMM Do YYYY, h:mm:ss a"),
      comments: [],
      createdBy,
      assignedUsersList,
    }

    await addDocument(project)
    if (!response.error) {
      navigate("/")
    }
  }

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project details:</span>
          <textarea
            type="text"
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input
            type="date"
            required
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
            required
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            options={users}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>

        <button className="btn">Add Project</button>
        {formError && <div className="error">{formError}</div>}
      </form>
    </div>
  )
}

export default Create
