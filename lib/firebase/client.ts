// lib/firebase/client.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { loadRuntimeFirebaseConfig } from '@/lib/runtimeConfig';
import { envConfig, fallbackConfig } from './config';

type FB = { app: ReturnType<typeof getApp>, auth: ReturnType<typeof getAuth>, db: ReturnType<typeof getFirestore> };
let ready: Promise<FB> | null = null;

export function initFirebaseAsync(): Promise<FB> {
  if (ready) return ready;
  ready = (async () => {
    const rt = await loadRuntimeFirebaseConfig();
    const cfg = rt ?? envConfig() ?? fallbackConfig;
    const app = getApps().length ? getApp() : initializeApp(cfg);
    return { app, auth: getAuth(app), db: getFirestore(app) };
  })();
  return ready;
}
