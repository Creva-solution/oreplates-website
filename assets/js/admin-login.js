import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Check if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'dashboard.html';
    }
});

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button');

        try {
            btn.innerText = 'Logging in...';
            btn.disabled = true;
            await signInWithEmailAndPassword(auth, email, password);
            // Redirection handled by onAuthStateChanged
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Failed: " + error.message);
            btn.innerText = 'Login';
            btn.disabled = false;
        }
    });
}
