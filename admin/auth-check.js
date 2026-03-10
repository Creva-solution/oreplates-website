// Admin Authentication Check
(async () => {
    // 1. Wait for Supabase to be available in global scope if included in script
    const checkAuth = async () => {
        if (!window.supabaseInstance) {
            console.warn('Supabase not yet initialized. Retrying auth check...');
            setTimeout(checkAuth, 100);
            return;
        }

        const { data, error } = await window.supabaseInstance.auth.getSession();
        
        if (error || !data.session) {
            console.error('Session not found or invalid. Redirecting to login...');
            window.location.href = 'login.html';
        } else {
            console.log('Session verified. Welcome, admin.');
            // Update UI if needed (e.g. welcome message)
            const welcomeText = document.querySelector('header span');
            if (welcomeText) welcomeText.innerText = `Logged in as ${data.session.user.email}`;
        }
    }

    checkAuth();
})();

// Logout Logic
async function logoutAdmin() {
    if (confirm('Are you sure you want to sign out?')) {
        const { error } = await window.supabaseInstance.auth.signOut();
        sessionStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    }
}
