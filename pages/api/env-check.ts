// pages/api/env-check.ts
import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const keys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  ];
  const out: Record<string, string | boolean> = {};
  keys.forEach(k => { out[k] = process.env[k] ? true : false; });
  res.status(200).json(out);
}
