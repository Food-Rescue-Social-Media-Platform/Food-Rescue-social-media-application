import { initializeApp,getApps } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from 'firebase/compat/app';
import { getDatabase } from "firebase/database";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
    

    // apiKey: "AIzaSyDiwU4JI2KtkDhg6uYMeL7125BmHtPQ_2A",
    // authDomain: "food-rescue-social-platform.firebaseapp.com",
    // projectId: "food-rescue-social-platform",
    // storageBucket: "food-rescue-social-platform.appspot.com",
    // messagingSenderId: "684711937854",
    // appId: "1:684711937854:web:aa16c5dfb5ff0fe8f68e6f",
    // measurementId: "G-P1SGVSNEJL"
};

let app;
if(getApps()?.length === 0){
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

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
export const db =  getDatabase();
export { auth };
