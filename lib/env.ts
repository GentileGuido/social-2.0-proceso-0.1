// lib/env.ts
export const normalizeEnv = (v?: string) =>
  (v || '').replace(/^['"]|['"]$/g, '') || undefined;

const req = (name: string) => {
  const raw = normalizeEnv(process.env[name]);
  if (!raw) throw new Error(`Missing ENV ${name}`);
  return raw;
};

export function getFirebaseEnv() {
  // TODOS deben existir en Railway a nivel **Service**, no solo Shared
  const apiKey           = req("NEXT_PUBLIC_FIREBASE_API_KEY");
  const authDomain       = req("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  const projectId        = req("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const storageBucket    = req("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  const messagingSenderId= req("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  const appId            = req("NEXT_PUBLIC_FIREBASE_APP_ID");
  const measurementId    = normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) || undefined;

  return {
    apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId,
  };
}
