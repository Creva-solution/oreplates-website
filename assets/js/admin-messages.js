import { db, auth } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Global functions for HTML buttons
window.markSeen = async (id) => {
    try {
        const msgRef = doc(db, "messages", id);
        await updateDoc(msgRef, { status: "seen" });
        loadMessages(); // Reload list
    } catch (error) {
        console.error("Error marking seen:", error);
        alert("Error updating status");
    }
};

window.deleteMessage = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
        try {
            await deleteDoc(doc(db, "messages", id));
            loadMessages(); // Reload list
        } catch (error) {
            console.error("Error deleting msg:", error);
            alert("Error deleting message");
        }
    }
};

// Logout Logic
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    });
});

// Main Logic
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadMessages();
    } else {
        window.location.href = 'login.html';
    }
});

async function loadMessages() {
    const tbody = document.getElementById('messages-list');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading...</td></tr>';

    try {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        tbody.innerHTML = '';

        if (querySnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No messages found.</td></tr>';
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const msg = docSnapshot.data();
            const id = docSnapshot.id;
            const date = msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'N/A';
            const statusClass = msg.status === 'new' ? 'status-new' : 'status-seen';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${msg.name || '-'}</td>
                <td>${msg.phone || '-'}</td>
                <td>${msg.location || '-'}</td>
                <td>${date}</td>
                <td><span class="${statusClass}">${msg.status?.toUpperCase() || 'NEW'}</span></td>
                <td style="max-width: 300px; font-size: 0.9rem;">${msg.message || '-'}</td>
                <td>
                    ${msg.status === 'new' ? `<button class="btn-action btn-seen" onclick="window.markSeen('${id}')">Mark Seen</button>` : ''}
                    <button class="btn-action btn-delete" onclick="window.deleteMessage('${id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading messages:", error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error loading messages: ${error.message}</td></tr>`;
    }
}
