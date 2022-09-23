import { useState, useEffect } from "react"
import { auth, db } from "../firebase/config"
import { doc, updateDoc } from "firebase/firestore"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    try {
      // login
      const res = await signInWithEmailAndPassword(auth, email, password)

      // online status updated
      const DocRef = doc(db, "users", res.user.uid)
      await updateDoc(DocRef, {
        online: true,
      })

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user })

      setIsPending(false)
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

  return { login, isPending, error }
}
