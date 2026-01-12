import { db, storage, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Auth Check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

const productForm = document.getElementById('product-form');

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Saving...';
        btn.disabled = true;

        try {
            // 1. Get Form Values
            const title = document.getElementById('title').value;
            const category = document.getElementById('category').value;
            const price = parseFloat(document.getElementById('price').value) || 0;
            const sizesStr = document.getElementById('sizes').value;
            const sizes = sizesStr.split(',').map(s => s.trim()).filter(s => s);
            const description = document.getElementById('description').value;
            const visible = document.getElementById('visible').checked;
            const imageFile = document.getElementById('image').files[0];

            let imageUrl = '';

            // 2. Upload Image if selected
            if (imageFile) {
                const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // 3. Save to Firestore
            await addDoc(collection(db, "products"), {
                title,
                category,
                price,
                sizes,
                description,
                visible,
                imageUrl,
                timestamp: serverTimestamp()
            });

            alert('Product saved successfully!');
            window.location.href = 'products.html';

        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product: " + error.message);
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}
