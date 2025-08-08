// lib/firebase.ts
import { isFirebaseEnabled } from './config';

let auth: any = null;
let db: any = null;
let googleProvider: any = null;

async function initializeFirebase() {
  if (isFirebaseEnabled) {
    const { auth: authInstance, db: dbInstance } = await import('./firebase/client');
    const { GoogleAuthProvider } = await import('firebase/auth');
    
    auth = authInstance;
    db = dbInstance;
    googleProvider = new GoogleAuthProvider();
  }
}

// Initialize Firebase if enabled
if (typeof window !== 'undefined') {
  initializeFirebase();
}

export { auth, db, googleProvider }; 