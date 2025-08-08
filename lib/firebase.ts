// lib/firebase.ts
import { isFirebaseEnabled, isDemoMode } from './config';
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { GoogleAuthProvider } from "firebase/auth";

// Demo mode - export safe stubs
export const isDemo = isDemoMode;
export const firebaseEnabled = !isDemoMode && isFirebaseEnabled;

let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

async function initializeFirebase() {
  if (firebaseEnabled) {
    const { auth: authInstance, db: dbInstance } = await import('./firebase/client');
    const { GoogleAuthProvider } = await import('firebase/auth');
    
    auth = authInstance;
    db = dbInstance;
    googleProvider = new GoogleAuthProvider();
  }
}

// Initialize Firebase if enabled
if (typeof window !== 'undefined' && !isDemoMode) {
  initializeFirebase();
}

export { auth, db, googleProvider }; 