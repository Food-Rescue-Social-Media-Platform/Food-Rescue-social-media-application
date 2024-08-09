import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDiwU4JI2KtkDhg6uYMeL7125BmHtPQ_2A",
    authDomain: "food-rescue-social-platform.firebaseapp.com",
    databaseURL: "https://food-rescue-social-platform-default-rtdb.firebaseio.com",
    projectId: "food-rescue-social-platform",
    storageBucket: "food-rescue-social-platform.appspot.com",
    messagingSenderId: "684711937854",
    appId: "1:684711937854:web:aa16c5dfb5ff0fe8f68e6f",
    measurementId: "G-P1SGVSNEJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
export const analytics = () => {
    if (typeof window !== "undefined") {
        return getAnalytics(app);
    } else {
        return null;
    }
};

// Initialize Authentication
let auth;
if (typeof window !== 'undefined' && window.document) {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

// Initialize Firestore, Storage, and Realtime Database
export const storage = getStorage(app);
export const database = getFirestore(app);
export const db = getDatabase(app);
export { auth, GoogleAuthProvider, signInWithCredential };
