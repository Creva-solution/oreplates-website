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
        console.log("Form submission started"); // Debug log

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Saving...';
        btn.disabled = true;

        try {
            // 1. Get Form Values
            console.log("Collecting form data..."); // Debug log
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
                console.log("Image selected:", imageFile.name); // Debug log
                // Sanitize filename to avoid issues with special characters
                const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const storagePath = `products/${Date.now()}_${sanitizedName}`;
                console.log("Uploading to:", storagePath); // Debug log

                const storageRef = ref(storage, storagePath);
                
                try {
                    const snapshot = await uploadBytes(storageRef, imageFile);
                    console.log("Upload success, snapshot:", snapshot); // Debug log
                    imageUrl = await getDownloadURL(snapshot.ref);
                    console.log("Image URL:", imageUrl); // Debug log
                } catch (uploadError) {
                    console.error("Storage Error:", uploadError);
                    throw new Error("Failed to upload image. Permission denied or storage quota exceeded? " + uploadError.code);
                }
            } else {
                console.log("No image selected"); // Debug log
            }

            // 3. Save to Firestore
            console.log("Saving to Firestore..."); // Debug log
            const productData = {
                title,
                category,
                price,
                sizes,
                description,
                visible,
                imageUrl,
                timestamp: serverTimestamp()
            };
            console.log("Data to save:", productData); // Debug log

            try {
                await addDoc(collection(db, "products"), productData);
                console.log("Firestore save success"); // Debug log
            } catch (dbError) {
                console.error("Firestore Error:", dbError);
                throw new Error("Failed to save database record. " + dbError.code);
            }

            alert('Product saved successfully!');
            window.location.href = 'products.html';

        } catch (error) {
            console.error("FINAL ERROR:", error);
            alert("Error saving product: " + error.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}
