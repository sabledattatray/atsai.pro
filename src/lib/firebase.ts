'use client';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if the apiKey is present (to support peaceful fallback/mock testing)
let authInstance: any = null;
let googleProviderInstance: any = null;
let githubProviderInstance: any = null;

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();
    githubProviderInstance = new GithubAuthProvider();
    
    // Add default scopes
    googleProviderInstance.addScope('profile');
    googleProviderInstance.addScope('email');
  } catch (error) {
    console.error("Failed to initialize Firebase app:", error);
  }
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;
export const githubProvider = githubProviderInstance;
export { signInWithPopup, signOut, onAuthStateChanged };
export type { User };
