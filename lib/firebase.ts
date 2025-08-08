// lib/firebase.ts
import { initFirebase } from './firebase/client';
import { GoogleAuthProvider } from 'firebase/auth';

let _firebase: ReturnType<typeof initFirebase> | null = null;

export function firebase() {
  if (!_firebase) {
    _firebase = initFirebase();
  }
  return _firebase;
}

export const googleProvider = new GoogleAuthProvider(); 