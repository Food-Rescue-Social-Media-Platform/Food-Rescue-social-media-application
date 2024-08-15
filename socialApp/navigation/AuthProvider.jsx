import React, { createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, database, GoogleAuthProvider, signInWithCredential } from '../firebase';
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserData, removerUserData } from '../redux/reducer/user';
import { FeedFollowers, addFeedFollowers } from '../FirebaseFunctions/collections/feedFollowers';
import Toast from 'react-native-toast-message';
import { signIn } from '../screens/authenticationScreens/googleSignIn';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const handleAuthStateChange = async (user) => {
            if (user) {
                const docRef = doc(database, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let userData = docSnap.data();
                    userData.id = user.uid;
                    dispatch(setUserData(userData));
                } else {
                    console.log("No such document!");
                }
            }
        };

        const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
        return () => unsubscribe();
    }, [dispatch]);

    const signInWithGoogle = async () => {
        try {
            const userInfo = await signIn();
            if (userInfo) {
                const { idToken, accessToken } = userInfo;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                const firebaseUser = await signInWithCredential(auth, credential);
    
                // Extract firstName and lastName from displayName
                const displayName = firebaseUser.user.displayName || '';
                const [firstName = '', lastName = ''] = displayName.split(' ', 2);
    
                // Check if user exists
                const docRef = doc(database, 'users', firebaseUser.user.uid);
                const docSnap = await getDoc(docRef);
    
                if (!docSnap.exists()) {
                    // If user does not exist, create a new user in Firestore
                    const newUser = {
                        userName: displayName,
                        firstName, // From displayName
                        lastName,  // From displayName
                        phoneNumber: "", // Empty phone number
                        email: firebaseUser.user.email,
                        profileImg: firebaseUser.user.photoURL,
                        createdAt: serverTimestamp(),
                        followingUsersId: [],
                        followersUsersId: [],
                        followingNum: 0,
                        followersNum: 0,
                        ratingNumber: 0,
                        bio: "",
                        location: "",
                        profileCover: "",
                        rating: 0,
                        earningPoints: 0,
                        postsId: [],
                        isAdmin: false,
                        postsNum: 0,
                    };
    
                    await setDoc(doc(database, 'users', firebaseUser.user.uid), newUser);
                    const feedFollowers = new FeedFollowers(firebaseUser.user.uid);
                    await addFeedFollowers(feedFollowers);
                }
    
                const userData = { id: firebaseUser.user.uid, ...userInfo };
                dispatch(setUserData(userData));
    
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Logged in with Google successfully.',
                });
            }
        } catch (error) {
            console.log('error', error);
            Toast.show({
                type: 'error',
                text1: 'Login Error',
                text2: 'An error occurred during Google sign-in.',
            });
        }
    };    

    return (
        <AuthContext.Provider 
            value={{
                user,
                setUser,
                signInWithGoogle,

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
                        }
                    } catch (error) {
                        throw error;
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

                            const feedFollowers = new FeedFollowers(uid);
                            await addFeedFollowers(feedFollowers);
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
