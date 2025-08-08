export const isFirebaseEnabled =
  (process.env.NEXT_PUBLIC_ENABLE_FIREBASE ?? "false").toLowerCase() === "true";

// Debug logging
console.log("[FLAGS]", { 
  NEXT_PUBLIC_ENABLE_FIREBASE: process.env.NEXT_PUBLIC_ENABLE_FIREBASE, 
  isFirebaseEnabled 
});
