let cached: any = null;

export async function loadRuntimeFirebaseConfig() {
  if (cached) return cached;
  try {
    const res = await fetch('/runtime-config/firebase.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('not found');
    cached = await res.json();
    return cached;
  } catch {
    return undefined;
  }
}
