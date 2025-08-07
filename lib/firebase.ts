import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth, GoogleAuthProvider as GoogleAuthProviderType } from 'firebase/auth';

const {
  NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} = process.env;

if (
  !NEXT_PUBLIC_FIREBASE_API_KEY ||
  !NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
  !NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  !NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
  !NEXT_PUBLIC_FIREBASE_APP_ID
) {
  throw new Error("Missing Firebase env vars");
}

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if we're in the browser
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProviderType | null = null;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    // Connect to emulator in development
    if (process.env.NODE_ENV === 'development') {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch {
        // Emulator might not be running, which is fine
        console.log('Firestore emulator not running');
      }
    }

    // Optional: Initialize Analytics only if measurementId exists
    if (NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && app) {
      import('firebase/analytics').then(({ getAnalytics }) => {
        try {
          getAnalytics(app!);
        } catch (error) {
          console.log('Analytics not available:', error);
        }
      }).catch((error) => {
        console.log('Failed to load Analytics:', error);
      });
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export { db, auth, googleProvider };
export default app; 