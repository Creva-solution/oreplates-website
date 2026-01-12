import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuYDoCKBrmPi9hRwdNsXyvTylL5AuohTo",
  authDomain: "oreplates-98e68.firebaseapp.com",
  projectId: "oreplates-98e68",
  storageBucket: "oreplates-98e68.firebasestorage.app",
  messagingSenderId: "614773442296",
  appId: "1:614773442296:web:4cdeeac1d10d9966949d0d",
  measurementId: "G-DHW15GF2B7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
