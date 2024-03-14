import React, { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from 'firebase/auth'; // Import Firebase functions
import { auth, database } from '../firebase'; // Import 'auth' from firebase.js
import { getDoc, setDoc, doc } from 'firebase/firestore'; // Import setDoc and doc functions from Firestore
import { useDispatch } from 'react-redux';
import { setUserData, removerUserData } from '../redux/reducer/user';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();

    return (
        <AuthContext.Provider 
            value={{
                user,
                setUser,

                login: async (email, password) => {
                    try {
                        await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
                            // Signed in
                            const user = userCredential.user;
                            // Get user info from Firestore
                            const docRef = doc(database, 'users', user.uid);
                            await getDoc(docRef).then((doc) => {
                                if (doc.exists()) {
                                    // Save user info to redux
                                    dispatch(setUserData(doc.data()));
                                } else {
                                    // doc.data() will be undefined in this case
                                    console.log("No such document!");
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });
                        
                        }).catch((error) => {
                            console.log(error);
                        });
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

                        // Save user info to Firestore under 'users' collection with the UID as the document ID
                        await setDoc(doc(database, 'users', uid), userInfo);
                        
                        // save user info to redux
                        dispatch(setUserData(userInfo));                        
                        }
                    } catch (e) {
                        dispatch(removerUserData());
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
                        dispatch(removerUserData());
                        console.log("logout");
                    } catch (e) {
                        dispatch(removerUserData());
                        console.log(e);
                    }
                },
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};