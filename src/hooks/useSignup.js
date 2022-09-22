import { useState, useEffect } from "react"
import { auth, storage } from "../firebase/config"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
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
      const img = ref(storage, uploadPath)

      const uploadTask = uploadBytesResumable(img, thumbnail)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log("Upload is " + progress + "% done")
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused")
              break
            case "running":
              console.log("Upload is running")
              break
            default:
              break
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("storage/unauthorized")
              break
            case "storage/canceled":
              console.log("storage/canceled")
              break
            case "storage/unknown":
              console.log("storage/unknown")
              break
            default:
              break
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL)
          })
        }
      )

      // add display name to user
      await updateProfile(auth.currentUser, { displayName, photoURL: imageUrl })

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user })

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
