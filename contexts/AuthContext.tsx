import React, { createContext, useContext, useEffect, useState } from 'react';
import { isFirebaseEnabled } from "@/lib/config";

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
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled) {
      // Mock mode
      const storedUser = getStoredUser();
      setUser(storedUser);
      setLoading(false);
    } else {
      // Firebase mode
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
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseEnabled) {
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
    if (!isFirebaseEnabled) {
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
