export function envConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export const fallbackConfig = {
  apiKey: "AIzaSyDW5oX7qxgfUxRAnRz-WZCH7sIshu6B-fI",
  authDomain: "social20proceso01.firebaseapp.com",
  projectId: "social20proceso01",
  storageBucket: "social20proceso01.appspot.com",
  messagingSenderId: "863308509063",
  appId: "1:863308509063:web:a5cfc8e50e8f301f3a2d22",
  measurementId: "G-J3PB5L78EH",
};
