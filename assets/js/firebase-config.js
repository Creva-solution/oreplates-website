import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYsqtX9SFgpb8izPhA-DZEqz9TO-uhUsU",
    authDomain: "ore-plates.firebaseapp.com",
    projectId: "ore-plates",
    storageBucket: "ore-plates.firebasestorage.app",
    messagingSenderId: "797510364696",
    appId: "1:797510364696:web:dcfc169b3d25041fc69d6d",
    measurementId: "G-KP49Z3PYPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
