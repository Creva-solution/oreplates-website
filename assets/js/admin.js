// Admin Panel Logic

document.addEventListener('DOMContentLoaded', () => {

    // Check Auth State
    if (window.location.pathname.includes('admin')) {
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in.
                console.log("User is logged in:", user.email);
                if (window.location.pathname.endsWith('login.html')) {
                    window.location.href = 'dashboard.html';
                }
                loadDashboardData();
            } else {
                // No user is signed in.
                console.log("No user logged in");
                if (!window.location.pathname.endsWith('login.html')) {
                    window.location.href = 'login.html';
                }
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Login Failed: " + errorMessage);
                });
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                window.location.href = 'login.html';
            });
        });
    }

    // Dashboard Logic
    function loadDashboardData() {
        if (!document.getElementById('product-list')) return;

        // Mock Data for demonstration if DB fails (or is empty)
        // In real app, fetch from Firestore: db.collection("products").get()...

        const products = [
            { id: '1', title: 'Round Plate 10"', category: 'Round', visible: true },
            { id: '2', title: 'Square Plate 8"', category: 'Square', visible: true },
            { id: '3', title: 'Partition Plate', category: 'Partition', visible: false }
        ];

        const tbody = document.getElementById('product-list');
        tbody.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.title}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.category}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span style="color: ${product.visible ? 'green' : 'gray'}; font-weight: bold;">
                        ${product.visible ? 'Active' : 'Hidden'}
                    </span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.8rem;">Edit</button>
                    <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.8rem; border-color: red; color: red;">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Update stats
        const statCards = document.querySelectorAll('.stat-card p');
        if (statCards.length >= 3) {
            statCards[0].textContent = products.length;
            statCards[1].textContent = products.filter(p => p.visible).length;
            statCards[2].textContent = products.filter(p => !p.visible).length;
        }
    }

    // Add Product Button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            window.location.href = 'product-form.html';
        });
    }

    // Product Form Logic
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Collect data
            const title = document.getElementById('title').value;
            // ... get other fields
            alert(`Product "${title}" saved! (This is a demo, connect Firebase to persist)`);
            window.location.href = 'dashboard.html';
        });
    }
});
