import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "placement-prep-pro-gqvdr",
  "appId": "1:925044498671:web:9094e370dd06941f60fb1a",
  "storageBucket": "placement-prep-pro-gqvdr.firebasestorage.app",
  "apiKey": "AIzaSyAdIPzMqtA8Hpy5anmgUw4uhOYS3uP-6H4",
  "authDomain": "placement-prep-pro-gqvdr.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "925044498671"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
