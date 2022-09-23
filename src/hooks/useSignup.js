import { useState, useEffect } from "react"
import { auth, storage, db } from "../firebase/config"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { collection, doc, setDoc } from "firebase/firestore"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)

    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password)

      if (!res) {
        throw new Error("Could not complete signup")
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const imgRef = ref(storage, uploadPath)
      const img = await uploadBytes(imgRef, thumbnail)
      const imgUrl = await getDownloadURL(img.ref)

      // add display name to user
      await updateProfile(res.user, { displayName, photoURL: imgUrl })

      // create a user document
      const collRef = collection(db, "users")
      const DocRef = doc(collRef, res.user.uid)
      await setDoc(DocRef, {
        online: true,
        displayName,
        photoURL: imgUrl,
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

  return { signup, error, isPending }
}
