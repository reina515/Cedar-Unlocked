// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyoF_Gf09CUM4XDeqa-_eVGZM0Rw_XAoU",
  authDomain: "ai-travel-planner-7b8cb.firebaseapp.com",
  projectId: "ai-travel-planner-7b8cb",
  storageBucket: "ai-travel-planner-7b8cb.firebasestorage.app",
  messagingSenderId: "871698685561",
  appId: "1:871698685561:web:2dd3395d27ddbd3f983ea8",
  measurementId: "G-GVNEHHGW0B"
};

// Initialize Firebase

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
