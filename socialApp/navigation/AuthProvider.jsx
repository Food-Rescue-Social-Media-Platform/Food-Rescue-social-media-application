import React, { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from 'firebase/auth'; // Import Firebase functions
import { auth, database } from '../firebase'; // Import 'auth' from firebase.js
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'; // Import setDoc and doc functions from Firestore

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

                register: async (email, password, userInfo) => {
                    try {
                        if(userInfo.password===userInfo.confirmPassword &&
                          userInfo.firstName != '' &&
                          userInfo.lastName != '' &&
                          userInfo.email != '' &&
                          userInfo.phoneNumber != '' &&
                          userInfo.password != '' &&
                          userInfo.confirmPassword != ''
                          ){
                            // Create user with email and password
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                        // Get the user's UID
                        const uid = userCredential.user.uid;
                        
                        // Additional user information
                        const additionalUserInfo = {
                            userName: userInfo.firstName + ' ' + userInfo.lastName,
                            location: "",
                            profileImg: "",
                            profileCover: "",
                            bio: "",
                            rating: 0,
                            earningPoints: 0,
                            postsId: [],
                            isAdmin: false,
                            postsNum: 0,
                            createdAt: serverTimestamp(),
                            followingUsersId: [],
                            followersUsersId: [],
                            followingNum: 0,
                            followersNum: 0,
                            ...userInfo // Merge with provided userInfo
                        };

                        // Save user info to Firestore under 'users' collection with the UID as the document ID
                        await setDoc(doc(database, 'users', uid), additionalUserInfo);
                        }
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
