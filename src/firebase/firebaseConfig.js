// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOXtZqhEHxkE7YHTL6wvAV-kA7i2e_pvs",
  authDomain: "student-managment-system-anshu.firebaseapp.com",
  projectId: "student-managment-system-anshu",
  storageBucket: "student-managment-system-anshu.firebasestorage.app",
  messagingSenderId: "509265550094",
  appId: "1:509265550094:web:9300d534ac7523b84ed55f",
  measurementId: "G-J6HF1K47YE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
