// src/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from "firebase/messaging";
import onMessageInForeground from "./messaging/foregroundMessage";
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Auth functions
const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
};

const signOutUser = (): Promise<void> => {
  return signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      console.error('Error during sign-out:', error);
      throw error;
    });
};

onMessage(messaging, onMessageInForeground);


export { auth, firestore, signInWithGoogle, signOutUser, storage, messaging };