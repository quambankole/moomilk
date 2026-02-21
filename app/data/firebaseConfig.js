import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAlpGcuYzgzWrUZQtgP1rDEaFrHhacYpj0",
    authDomain: "milkbooth-e1343.firebaseapp.com",
    projectId: "milkbooth-e1343",
    storageBucket: "milkbooth-e1343.firebasestorage.app",
    messagingSenderId: "493468535787",
    appId: "1:493468535787:web:b7faf732d8abb40611a7ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
