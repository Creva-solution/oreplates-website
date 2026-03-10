document.addEventListener('DOMContentLoaded', () => {
    // Inject Mobile Header and Overlay if not present
    if (!document.querySelector('.mobile-header') && window.innerWidth <= 992) {
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header';
        mobileHeader.innerHTML = `
            <div class="logo">
                <img src="../assets/images/logo.svg" alt="Logo" style="height: 30px;">
                <span style="font-weight:700; color:var(--primary); margin-left:10px;">Oreplates Admin</span>
            </div>
            <div class="menu-trigger" id="sidebarTrigger">
                <i class="fas fa-bars"></i>
            </div>
        `;
        document.body.prepend(mobileHeader);

        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);

        const trigger = document.getElementById('sidebarTrigger');
        const sidebar = document.querySelector('.sidebar');
        const overlayEl = document.getElementById('sidebarOverlay');

        trigger.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlayEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        overlayEl.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlayEl.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Handle logout reliably
    window.logoutAdmin = () => {
        if(confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('admin_logged_in');
            window.location.href = 'login.html';
        }
    }
});
