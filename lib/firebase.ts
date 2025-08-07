import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth, GoogleAuthProvider as GoogleAuthProviderType } from 'firebase/auth';

// Helper function to safely get environment variables
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  return value ? value.trim() : '';
};

// Firebase configuration
const firebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

// Initialize Firebase only if we're in the browser
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProviderType | null = null;

if (typeof window !== 'undefined') {
  try {
    // Check if we have the minimum required config
    const hasValidConfig = firebaseConfig.apiKey && 
                          firebaseConfig.authDomain && 
                          firebaseConfig.projectId && 
                          firebaseConfig.storageBucket && 
                          firebaseConfig.messagingSenderId && 
                          firebaseConfig.appId;

    if (hasValidConfig) {
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

      // Optional: Initialize Analytics only if measurementId exists
      if (firebaseConfig.measurementId && app) {
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
    } else {
      console.warn('Firebase config incomplete. Missing required environment variables.');
      console.warn('Please check your environment variables in Railway.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export { db, auth, googleProvider };
export default app; 