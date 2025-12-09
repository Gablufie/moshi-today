// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBCpeZjcIn8pBb9qz4e7WZKY1fIZz-jtpg",
  authDomain: "moshi-today.firebaseapp.com",
  projectId: "moshi-today",
  storageBucket: "moshi-today.appspot.com",
  messagingSenderId: "544409789800",
  appId: "1:544409789800:web:c74fe4aa83dfeb24ec22dd"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)