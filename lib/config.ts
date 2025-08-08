export const isFirebaseEnabled =
  (process.env.NEXT_PUBLIC_ENABLE_FIREBASE ?? "false").toLowerCase() === "true";
