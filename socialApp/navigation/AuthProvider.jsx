import React, { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, database } from '../firebase';
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserData, removerUserData } from '../redux/reducer/user';
import Toast from 'react-native-toast-message';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider 
            value={{
                user,
                setUser,

                login: async (email, password) => {
                    try {
                        const userCredential = await signInWithEmailAndPassword(auth, email, password);
                        const user = userCredential.user;
                        
                        const docRef = doc(database, 'users', user.uid);
                        const docSnap = await getDoc(docRef);
                        
                        if (docSnap.exists()) {
                            let userData = docSnap.data();
                            userData.id = user.uid;
                            dispatch(setUserData(userData));
                        } else {
                            console.log("No such document!");
                            throw new Error('No such document');
                        }
                    } catch (error) {
                        throw error; // Rethrow the error so it can be caught in the component
                    }
                },

                register: async (email, password, userInfo) => {
                    try {
                        if(userInfo.password === userInfo.confirmPassword &&
                          userInfo.firstName !== '' &&
                          userInfo.lastName !== '' &&
                          userInfo.email !== '' &&
                          userInfo.phoneNumber !== '' &&
                          userInfo.password !== '' &&
                          userInfo.confirmPassword !== '') {
                            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                            const uid = userCredential.user.uid;
                        
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
                                ratingNumber: 0,
                                ...userInfo
                            };

                            await setDoc(doc(database, 'users', uid), additionalUserInfo);
                        }
                    } catch (error) {
                        if (error.code === 'auth/email-already-in-use') {
                            throw new Error('Email already in use');
                        } else {
                            throw error;
                        }
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
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Logged out successfully.',
                        });
                    } catch (e) {
                        dispatch(removerUserData());
                        console.log(e);
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Failed to log out.',
                        });
                    }
                },
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};
