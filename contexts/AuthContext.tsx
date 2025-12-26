
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, firebase } from "../lib/firebase";

interface AuthContextType {
  user: firebase.User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase Auth is initialized, listen to state changes
    if (auth) {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    } else {
        // If no Firebase, we are in Demo Mode. 
        setLoading(false);
        return () => {};
    }
  }, []);

  // Helper to simulate login for Demo Mode or Fallback
  const loginMockUser = async () => {
    console.log("Fallback: Entering Demo Mode due to Firebase connection issues.");
    await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay
    
    // Create a mock user object compatible with firebase.User structure
    const mockUser = {
        uid: "demo-user-123",
        displayName: "Гость (Демо)",
        email: "demo@photosmart.ru",
        photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "mock-token",
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        phoneNumber: null
    } as unknown as firebase.User;
    
    setUser(mockUser);
  };

  const signInWithGoogle = async () => {
    if (auth && googleProvider) {
        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            const fallbackErrors = [
                'auth/unauthorized-domain', 
                'auth/api-key-not-valid', 
                'auth/operation-not-allowed',
                'auth/network-request-failed'
            ];
            
            if (fallbackErrors.includes(error.code)) {
                console.warn(`Firebase Auth issue (${error.code}). Switching to Demo Mode.`);
                await loginMockUser();
            } else {
                if (error.code !== 'auth/popup-closed-by-user') {
                    // For other errors, still try fallback to keep app usable
                    await loginMockUser();
                } else {
                    throw error;
                }
            }
        }
    } else {
        await loginMockUser();
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (auth) {
        try {
            await auth.signInWithEmailAndPassword(email, pass);
        } catch (error: any) {
             console.error("Error logging in with email", error);
             if (error.code === 'auth/network-request-failed') {
                 console.warn("Network error during login. Switching to Demo Mode.");
                 await loginMockUser();
                 return;
             }
             throw error;
        }
    } else {
        await loginMockUser();
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    if (auth) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
            // Update display name immediately
            if (userCredential.user) {
                await userCredential.user.updateProfile({
                    displayName: name,
                    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
                });
                // Trigger a reload to update local state if needed
                setUser({ ...userCredential.user, displayName: name, photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` } as firebase.User);
            }
        } catch (error: any) {
             console.error("Error registering", error);
             if (error.code === 'auth/network-request-failed') {
                 console.warn("Network error during registration. Switching to Demo Mode.");
                 await loginMockUser();
                 return;
             }
             throw error;
        }
    } else {
        await loginMockUser();
    }
  };

  const logout = async () => {
    if (auth) {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error signing out", error);
        }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
