import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsCfi4_isdaY9VoJ-ayNKO-fRCjRWFM-U",
  authDomain: "test-4-57c98.firebaseapp.com",
  projectId: "test-4-57c98",
  storageBucket: "test-4-57c98.appspot.com",
  messagingSenderId: "705448668678",
  appId: "1:705448668678:web:bce9fa77920b486908dd87",
  measurementId: "G-5Q4X76K8K5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
