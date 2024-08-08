import React, { createContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, database, GoogleAuthProvider, signInWithCredential } from '../firebase';
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserData, removerUserData } from '../redux/reducer/user';
import { FeedFollowers, addFeedFollowers } from '../FirebaseFunctions/collections/feedFollowers';
import Toast from 'react-native-toast-message';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '684711937854-ct1n3i8ak7dlb9co4vir7s58oo0jbf6k.apps.googleusercontent.com',
        androidClientId: '684711937854-n0vv51uhqghlhvbepo9raa9g1t0k5qab.apps.googleusercontent.com',
        webClientId: '684711937854-83lmp0kaol8jkjif24gokmcms9npia7t.apps.googleusercontent.com',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, access_token } = response.params;

            const credential = GoogleAuthProvider.credential(id_token, access_token);
            signInWithCredential(auth, credential).then(async (firebaseUser) => {
                const docRef = doc(database, 'users', firebaseUser.user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let userData = docSnap.data();
                    userData.id = firebaseUser.user.uid;
                    dispatch(setUserData(userData));
                } else {
                    console.log("No such document!");
                    throw new Error('No such document');
                }

                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Logged in with Google successfully.',
                });
            }).catch(error => {
                console.log('error', error);
                Toast.show({
                    type: 'error',
                    text1: 'Login Error',
                    text2: 'An error occurred during Google sign-in.',
                });
            });
        }
    }, [response]);

    const signInWithGoogle = async () => {
        promptAsync();
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
                            throw new Error('No such document');
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
