
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key is missing. Please check your .env file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set.');
}

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
    try {
        enableIndexedDbPersistence(db);
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn(
          'Firestore persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.'
        );
      } else if (err.code === 'unimplemented') {
        console.warn(
          'Firestore persistence failed: The current browser does not support all of the features required to enable persistence.'
        );
      }
    }
}


export { db, auth, app };
