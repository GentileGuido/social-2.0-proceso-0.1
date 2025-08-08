import { isFirebaseEnabled } from "@/lib/config";
import type { SocialRepo } from "./Repo";

export async function getRepo(): Promise<SocialRepo> {
  if (!isFirebaseEnabled) {
    const { LocalStorageRepo } = await import("./localStorageRepo");
    return new LocalStorageRepo();
  }
  // Keep Firebase version ready for the future (don't implement now).
  // When we re-enable, import and return FirestoreRepo here.
  const { LocalStorageRepo } = await import("./localStorageRepo");
  return new LocalStorageRepo(); // temporary fallback
}
