// lib/firebase.ts
import { auth, db } from './firebase/client';
import { GoogleAuthProvider } from 'firebase/auth';

export { auth, db };
export const googleProvider = new GoogleAuthProvider(); 