import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { db } from "../../services/firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB5YKKotSzVORSifnobZabxscUvSpPGhUM",
  authDomain: "agenda-inteligente-fcdf7.firebaseapp.com",
  projectId: "agenda-inteligente-fcdf7",
  storageBucket: "agenda-inteligente-fcdf7.firebasestorage.app",
  messagingSenderId: "332377686868",
  appId: "1:332377686868:web:bb720d9593e74300da7ec1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export default app;


