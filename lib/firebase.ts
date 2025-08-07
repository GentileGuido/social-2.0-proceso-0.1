import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth, GoogleAuthProvider as GoogleAuthProviderType } from 'firebase/auth';

// Helper function to safely get and trim environment variables
const env = (key: string): string => (process.env[key] ?? '').trim();

const firebaseConfig = {
  apiKey: env('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: env('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: env('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

// Initialize Firebase only if we're in the browser and have valid config
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProviderType | null = null;

// Check if we have the minimum required config
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.authDomain && 
                      firebaseConfig.projectId && 
                      firebaseConfig.storageBucket && 
                      firebaseConfig.messagingSenderId && 
                      firebaseConfig.appId;

if (typeof window !== 'undefined' && hasValidConfig) {
  try {
    // Safe initialization pattern
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
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

    // Optional: Initialize Analytics only on client side
    if (firebaseConfig.measurementId && app) {
      import('firebase/analytics').then(({ getAnalytics }) => {
        try {
          getAnalytics(app!);
        } catch (error) {
          console.log('Analytics not available:', error);
        }
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