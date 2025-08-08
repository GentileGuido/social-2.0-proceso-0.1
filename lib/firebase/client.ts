// lib/firebase/client.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { normalizeEnv } from '@/lib/env';

let auth: any = null;
let db: any = null;

if (typeof window !== 'undefined') {
  const cfg = {
    apiKey: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket:
      normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) ||
      'social20proceso01.appspot.com',
    messagingSenderId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    measurementId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
  };

  if (process.env.NODE_ENV !== 'production') {
    const missing = Object.entries(cfg).filter(([,v]) => !v).map(([k]) => k);
    if (missing.length) console.warn('Missing Firebase envs:', missing);
  }

  const app = getApps().length ? getApp() : initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
