import { useEffect, useState } from "react"
import { db } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore"

export const useDocument = (coll, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // realtime data
  useEffect(() => {
    const docRef = doc(db, coll, id)
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setDocument({ ...snapshot.data(), id: snapshot.id })
        setError(null)
      },
      (err) => {
        console.log(err.message)
        setError("failed to get document")
      }
    )

    // unmount or unsubscribe
    return () => unsubscribe()
  }, [coll, id])

  return { document, error }
}
