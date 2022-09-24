import { useReducer, useEffect, useState } from "react"
import { db } from "../firebase/config"
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore"

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null }
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      }
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null }
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      }
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const useFirestore = (coll) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // collection ref
  const ref = collection(db, coll)

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" })

    try {
      const createdAt = serverTimestamp()
      const addedDocument = await addDoc(ref, { ...doc, createdAt })
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument })
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
    }
  }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" })

    try {
      const docRef = doc(ref, id)
      await deleteDoc(docRef)
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" })
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" })
    }
  }

  // update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" })

    try {
      const docRef = doc(ref, id)
      const updatingDocument = updateDoc(docRef, updates)
      // const updatingDocument = ref.doc(id).update
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatingDocument,
      })
      return updatingDocument
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
      return null
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, updateDocument, response }
}
