import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth, GoogleAuthProvider as GoogleAuthProviderType } from 'firebase/auth';

// Helper function to safely get and normalize environment variables
const getEnvVar = (key: string): string | undefined => {
  const value = process.env[key];
  if (!value) return undefined;
  
  // Trim whitespace and normalize dashes (fix for en-dash/em-dash issues)
  return value.trim().replace(/\u2013|\u2014/g, '-');
};

// Firebase configuration with proper validation
const cfg = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

// Validate required fields
const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
const missing = required.filter((k) => !cfg[k]);

if (missing.length > 0) {
  console.warn('Firebase config incomplete. Missing:', missing);
  console.warn('Please check your environment variables in Railway.');
  console.warn('Required variables:', required);
}

// Initialize Firebase only if we have all required config and we're in the browser
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProviderType | null = null;

if (typeof window !== 'undefined' && missing.length === 0) {
  try {
    // Safe initialization pattern
    app = !getApps().length ? initializeApp(cfg) : getApp();
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
    if (cfg.measurementId && app) {
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
} else if (typeof window !== 'undefined') {
  console.warn('Firebase not initialized: Missing required environment variables');
}

export { db, auth, googleProvider };
export default app; 