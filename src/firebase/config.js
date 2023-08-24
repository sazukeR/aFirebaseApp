// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getEnvironments } from "../helpers";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const {
  VITE_APIKEY,
  VITE_AUTHDOMAIN,
  VITE_PROJECTID,
  VITE_STORAGEBUCKET,
  VITE_MESSAGINGSENDERID,
  VITE_APPID,
} = getEnvironments();

// DEV/PRODUCTION
/* const firebaseConfig = {
  apiKey: "AIzaSyBOuW1uc6aOdb_Wo9j2tsV_ioS4ESKr0ws",
  authDomain: "react-rei.firebaseapp.com",
  projectId: "react-rei",
  storageBucket: "react-rei.appspot.com",
  messagingSenderId: "228431557242",
  appId: "1:228431557242:web:162fe0dadcdd5446de81c3",
}; */

////////////////////////////////////////////

// TESTING
const firebaseConfig = {
  apiKey: VITE_APIKEY,
  authDomain: VITE_AUTHDOMAIN,
  projectId: VITE_PROJECTID,
  storageBucket: VITE_STORAGEBUCKET,
  messagingSenderId: VITE_MESSAGINGSENDERID,
  appId: VITE_APPID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);