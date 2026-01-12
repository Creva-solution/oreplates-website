import { db, auth } from './firebase-config.js';
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Global Actions
window.deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteDoc(doc(db, "products", id));
            loadProducts();
            alert('Product deleted');
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting product");
        }
    }
};

window.editProduct = (id) => {
    // For now, allow simple ID logging or redirect
    console.log("Edit product:", id);
    alert(`Edit feature coming soon (Product ID: ${id})`);
};

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => window.location.href = 'login.html');
});

// Auth Check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        loadProducts();
    }
});

async function loadProducts() {
    const tbody = document.getElementById('product-list');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        tbody.innerHTML = '';

        if (querySnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No products found.</td></tr>';
            updateStats(0, 0, 0);
            return;
        }

        let total = 0, active = 0, hidden = 0;

        querySnapshot.forEach((docSnap) => {
            const p = docSnap.data();
            const id = docSnap.id;

            total++;
            if (p.visible) active++; else hidden++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.title || 'Untitled'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.category || '-'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span style="color: ${p.visible ? 'green' : 'gray'}; font-weight: bold;">
                        ${p.visible ? 'Active' : 'Hidden'}
                    </span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <button onclick="window.editProduct('${id}')" style="margin-right:5px; cursor:pointer;">Edit</button>
                    <button onclick="window.deleteProduct('${id}')" style="color:red; cursor:pointer;">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        updateStats(total, active, hidden);

    } catch (error) {
        console.error("Error loading products:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
    }
}

function updateStats(total, active, hiddenCount) {
    const statCards = document.querySelectorAll('.stat-card p');
    if (statCards.length >= 3) {
        statCards[0].textContent = total;
        statCards[1].textContent = active;
        statCards[2].textContent = hiddenCount;
    }
}
