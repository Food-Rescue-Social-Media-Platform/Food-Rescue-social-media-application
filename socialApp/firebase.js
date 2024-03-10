import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDiwU4JI2KtkDhg6uYMeL7125BmHtPQ_2A",
    authDomain: "food-rescue-social-platform.firebaseapp.com",
    projectId: "food-rescue-social-platform",
    storageBucket: "food-rescue-social-platform.appspot.com",
    messagingSenderId: "684711937854",
    appId: "1:684711937854:web:aa16c5dfb5ff0fe8f68e6f"
};

export const app = initializeApp(firebaseConfig);

let auth;

if (typeof window !== 'undefined' && window.document) {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

export { auth };
