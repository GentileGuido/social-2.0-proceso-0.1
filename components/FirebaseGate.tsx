import { useEffect, useState } from 'react';
import { initFirebaseAsync } from '@/lib/firebase/client';

export default function FirebaseGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let mounted = true;
    initFirebaseAsync()
      .then(() => mounted && setOk(true))
      .catch(() => mounted && setOk(true)); // no bloquear
    return () => { mounted = false; };
  }, []);
  if (!ok) return null; // o un spinner
  return <>{children}</>;
}
