import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD2Hxq8jYZDmGSHLaN7fSsgWkvxuQ-6uIA",
  authDomain: "chat-317a8.firebaseapp.com",
  projectId: "chat-317a8",
  storageBucket: "chat-317a8.appspot.com",
  messagingSenderId: "716963991205",
  appId: "1:716963991205:web:a33631e523536d1a9b474c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()