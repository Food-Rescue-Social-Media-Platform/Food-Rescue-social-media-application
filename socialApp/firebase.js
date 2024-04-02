import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from 'firebase/compat/app';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDiwU4JI2KtkDhg6uYMeL7125BmHtPQ_2A",
    authDomain: "food-rescue-social-platform.firebaseapp.com",
    projectId: "food-rescue-social-platform",
    storageBucket: "food-rescue-social-platform.appspot.com",
    messagingSenderId: "684711937854",
    appId: "1:684711937854:web:aa16c5dfb5ff0fe8f68e6f",
    measurementId: "G-P1SGVSNEJL"
};

export const app = initializeApp(firebaseConfig);
export const analytics = () => {
    if (typeof window !== "undefined") {
      return getAnalytics()
    } else {
      return null
    }
}

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);   
}


let auth;
if (typeof window !== 'undefined' && window.document) {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

export const storage = getStorage(app);
export const database = getFirestore(app);
const db =  getDatabase();
export { db };
export { auth };
