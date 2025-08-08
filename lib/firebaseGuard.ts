export function missingFirebaseEnv() {
  // In demo mode, never show missing config screen
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return false;
  }
  
  const keys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;
  return keys.some(k => !process.env[k]);
}
