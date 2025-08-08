// lib/firebase.ts
import { initFirebaseAsync } from './firebase/client';
import { GoogleAuthProvider } from 'firebase/auth';

export { initFirebaseAsync };
export const googleProvider = new GoogleAuthProvider(); 