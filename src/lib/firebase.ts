// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "placement-prep-pro-gqvdr",
  appId: "1:925044498671:web:9094e370dd06941f60fb1a",
  storageBucket: "placement-prep-pro-gqvdr.firebasestorage.app",
  apiKey: "AIzaSyAdIPzMqtA8Hpy5anmgUw4uhOYS3uP-6H4",
  authDomain: "placement-prep-pro-gqvdr.firebaseapp.com",
  messagingSenderId: "925044498671"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
