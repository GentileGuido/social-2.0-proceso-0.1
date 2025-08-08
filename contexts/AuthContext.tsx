import React, { createContext, useContext, useEffect, useState } from 'react';
import { isFirebaseEnabled, isDemoMode } from "@/lib/config";

// Mock user type
type MockUser = { uid: string; displayName: string; email?: string; photoURL?: string | null };

// Mock auth functions
function getStoredUser(): MockUser | null {
  try { return JSON.parse(localStorage.getItem("mock:user") || "null"); } catch { return null; }
}

function setStoredUser(u: MockUser | null) {
  if (u) localStorage.setItem("mock:user", JSON.stringify(u));
  else localStorage.removeItem("mock:user");
}

const mockSignIn = async () => {
  const u = getStoredUser() ?? { uid: "demo-user", displayName: "Demo User" };
  setStoredUser(u);
  return u;
};

const mockSignOut = async () => setStoredUser(null);

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [user, setUser] = useState(DEMO ? ({ uid: 'demo', displayName: 'Demo User' } as any) : null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (DEMO) {
      // Demo mode - auto sign in with mock user
      setLoading(false);
    } else if (!isFirebaseEnabled) {
      // Mock mode (not demo)
      const storedUser = getStoredUser();
      setUser(storedUser);
      setLoading(false);
    } else {
      // Firebase mode
      setLoading(true);
      const initFirebaseAuth = async () => {
        try {
          const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } = await import("firebase/auth");
          const { auth, googleProvider } = await import("../lib/firebase");
          
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
          });

          return unsubscribe;
        } catch (error) {
          console.error('Failed to initialize Firebase:', error);
          setLoading(false);
        }
      };

      initFirebaseAuth();
    }
  }, [DEMO]);

  const signInWithGoogle = async () => {
    if (DEMO) {
      // Demo mode - no-op, user is already signed in
      return;
    } else if (!isFirebaseEnabled) {
      // Mock mode
      const mockUser = await mockSignIn();
      setUser(mockUser);
    } else {
      // Firebase mode
      try {
        const { signInWithPopup } = await import("firebase/auth");
        const { auth, googleProvider } = await import("../lib/firebase");
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    }
  };

  const signOutUser = async () => {
    if (DEMO) {
      // Demo mode - reset to demo user
      return;
    } else if (!isFirebaseEnabled) {
      // Mock mode
      await mockSignOut();
      setUser(null);
    } else {
      // Firebase mode
      try {
        const { signOut } = await import("firebase/auth");
        const { auth } = await import("../lib/firebase");
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
