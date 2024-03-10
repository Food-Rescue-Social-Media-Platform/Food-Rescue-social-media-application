import React, { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from 'firebase/auth'; // Import Firebase functions
import { auth } from '../firebase'; // Import 'auth' from firebase.js

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    return (
        <AuthContext.Provider 
            value={{
                user,
                setUser,

                login: async (email, password) => {
                    try {
                        await signInWithEmailAndPassword(auth, email, password);
                    } catch (e) {
                        console.log(e);
                    }
                },

                register: async (email, password) => {
                    try {
                        await createUserWithEmailAndPassword(auth, email, password);
                    } catch (e) {
                        console.log(e);
                    }
                },

                forgotPassword: async (email) => {
                    try {
                        await sendPasswordResetEmail(auth, email);
                    } catch (e) {
                        console.log(e);
                    }
                },

                logout: async () => {
                    try {
                        await signOut(auth);
                    } catch (e) {
                        console.log(e);
                    }
                },
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};
