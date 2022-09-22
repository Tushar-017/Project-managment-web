import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDZolDi_ASrCipaouYH-UHJ-KgwfQUWQtw",
  authDomain: "project-managment-app-70466.firebaseapp.com",
  projectId: "project-managment-app-70466",
  storageBucket: "project-managment-app-70466.appspot.com",
  messagingSenderId: "1010365259485",
  appId: "1:1010365259485:web:b68afa848ecba16c6d8534",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
// export const timestamp = serverTimestamp()
