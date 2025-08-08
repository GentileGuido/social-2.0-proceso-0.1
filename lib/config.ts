export const isFirebaseEnabled =
  (process.env.NEXT_PUBLIC_ENABLE_FIREBASE ?? "false").toLowerCase() === "true";

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Debug logging
console.log("[FLAGS]", { 
  NEXT_PUBLIC_ENABLE_FIREBASE: process.env.NEXT_PUBLIC_ENABLE_FIREBASE, 
  NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  isFirebaseEnabled,
  isDemoMode
});
