// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics, isSupported as analyticsSupported } from "firebase/analytics";
import { getFirebaseEnv } from "./env";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _analytics: Analytics | null = null;

export function firebase() {
  if (_app) return { app: _app, auth: _auth!, db: _db!, analytics: _analytics };

  const cfg = getFirebaseEnv(); // lanza error si falta algo
  const app = getApps().length ? getApp() : initializeApp(cfg);

  const auth = getAuth(app);
  const db   = getFirestore(app);

  _app = app; _auth = auth; _db = db;

  // Analytics (solo si soportado y si hay measurementId)
  (async () => {
    try {
      if (cfg.measurementId && (await analyticsSupported())) {
        _analytics = getAnalytics(app);
      }
    } catch {}
  })();

  return { app, auth, db, analytics: _analytics };
}

export const googleProvider = new GoogleAuthProvider(); 