// lib/firebase.ts
import { isFirebaseEnabled, isDemoMode } from './config';

// Demo mode - export safe stubs
export const isDemo = isDemoMode;
export const firebaseEnabled = !isDemoMode && isFirebaseEnabled;

let auth: any = null;
let db: any = null;
let googleProvider: any = null;

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