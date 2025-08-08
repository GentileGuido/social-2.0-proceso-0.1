// lib/firebase/client.ts
import { isFirebaseEnabled } from "../config";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

async function initializeFirebase() {
  if (isFirebaseEnabled && typeof window !== 'undefined') {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    // Guard: helpful error if something is missing
    const required = [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      // surface a clear error in console + a UI you already have
      // do NOT throw during build; only warn at runtime
      // eslint-disable-next-line no-console
      console.error("Firebase config incomplete. Missing:", missing);
    }

    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// Initialize Firebase if enabled
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Analytics only if available and browser-side
export const analyticsPromise = isFirebaseEnabled && typeof window !== "undefined"
  ? (async () => {
      const { getAnalytics, isSupported } = await import("firebase/analytics");
      const supported = await isSupported();
      return supported ? getAnalytics(app) : null;
    })()
  : Promise.resolve(null);

export { app, auth, db };
