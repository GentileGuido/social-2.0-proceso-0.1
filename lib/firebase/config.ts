// lib/firebase/config.ts
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDW5oX7qxgfUxRAnRz-WZCH7sIshu6B-fI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "social20proceso01.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "social20proceso01",
  // OJO: el bucket correcto para SDK web es *.appspot.com
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "social20proceso01.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "863308509063",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:863308509063:web:a5cfc8e50e8f301f3a2d22",
  // measurementId opcional: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
