
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, firebase } from "../lib/firebase";

interface AuthContextType {
    user: firebase.User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * On localhost we skip the emailVerified gate so test accounts can sign in
 * without a real inbox. Production keeps the verification requirement.
 */
const isLocalDev = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth) {
            const unsubscribe = auth.onAuthStateChanged((currentUser) => {
                if (currentUser && !currentUser.emailVerified && !isLocalDev) {
                    auth.signOut().catch(e => console.error("Signout error", e));
                    setUser(null);
                } else {
                    setUser(currentUser);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
            return () => { };
        }
    }, []);

    const signInWithGoogle = async () => {
        if (!auth || !googleProvider) {
            throw new Error("Вход недоступен. Проверьте подключение.");
        }
        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        if (!auth) {
            throw new Error("Вход недоступен. Проверьте подключение.");
        }
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, pass);
            if (userCredential.user && !userCredential.user.emailVerified && !isLocalDev) {
                await auth.signOut();
                throw new Error("unverified-email");
            }
        } catch (error: any) {
            console.error("Error logging in with email", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, pass: string, name: string) => {
        if (!auth) {
            throw new Error("Регистрация недоступна. Проверьте подключение.");
        }
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
            if (userCredential.user) {
                await userCredential.user.updateProfile({
                    displayName: name,
                    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
                });
                await userCredential.user.sendEmailVerification();
                await auth.signOut();
            }
        } catch (error: any) {
            console.error("Error registering", error);
            throw error;
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

    const resetPassword = async (email: string) => {
        if (!auth) {
            throw new Error("Восстановление пароля недоступно. Проверьте подключение.");
        }
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (error: any) {
            // Surface the real cause instead of a silent success on the UI.
            console.error("sendPasswordResetEmail failed", error?.code, error?.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
