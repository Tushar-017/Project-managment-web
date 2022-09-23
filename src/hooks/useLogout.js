import { useEffect, useState } from "react"
import { auth, db } from "../firebase/config"
import { doc, updateDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()

  const logout = async () => {
    setError(null)
    setIsPending(true)

    try {
      // update online status
      const { uid } = user
      const DocRef = doc(db, "users", uid)
      await updateDoc(DocRef, {
        online: false,
      })

      // sign the user out
      await signOut(auth)

      // dispatch logout action
      dispatch({ type: "LOGOUT" })
      setIsPending(false)
      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { logout, error, isPending }
}
