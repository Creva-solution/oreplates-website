// Language Translation Trigger
function translatePage(langCode) {
    const googCombo = document.querySelector('.goog-te-combo');
    if (googCombo) {
        googCombo.value = langCode;
        googCombo.dispatchEvent(new Event('change'));
        
        // Update button styles
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const text = btn.textContent.trim().toUpperCase();
            if (langCode === 'en' && (text.includes('ENGLISH') || text === 'EN')) {
                btn.classList.add('active');
            } else if (langCode === 'ta' && (text.includes('தமிழ்') || text === 'TA')) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Save preference
        localStorage.setItem('preferredLanguage', langCode);
    } else {
        setTimeout(() => translatePage(langCode), 500);
    }
}

// Initialize translation based on saved preference
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        setTimeout(() => translatePage(savedLang), 1500);
    }
});

// Mobile Menu Toggling
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }

        const closeMenu = () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('menu-open');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open-body');
        };

        const openMenu = () => {
            navLinks.classList.add('active');
            menuToggle.classList.add('menu-open');
            overlay.classList.add('active');
            document.body.classList.add('menu-open-body');
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            closeMenu();
        });

        // Close on window resize if switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Dynamic Copyright Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }

    // Load Company Settings Globally from Supabase
    async function applyCompanySettings() {
        let settings = JSON.parse(localStorage.getItem('company_settings') || '{}');
        
        try {
            if (window.supabaseInstance) {
                const { data, error } = await window.supabaseInstance
                    .from('company_settings')
                    .select('*')
                    .eq('id', 1)
                    .single();
                
                if (error) throw error;
                if (data) {
                    settings = data;
                    localStorage.setItem('company_settings', JSON.stringify(data));
                }
            }
        } catch (err) {
            console.warn('Supabase settings fetch failed:', err);
        }

        if (!settings.name) return;

        // Update footer contact info
        const footerContactCol = document.getElementById('footer-contact-details');
        if (footerContactCol) {
            const items = footerContactCol.querySelectorAll('.footer-contact-item p');
            if (items.length >= 3) {
                items[0].innerHTML = settings.address.replace(/\n/g, '<br>');
                items[1].innerHTML = settings.phone.replace(/,/g, '<br>');
                items[2].innerHTML = (settings.email || 'oreplates@gmail.com');
            }
        }

        // Update floating call/wa buttons
        const floatCall = document.getElementById('float-call');
        const floatWa = document.getElementById('float-wa');
        if (settings.phone) {
            const phones = settings.phone.split(',');
            const primaryPhone = phones[0].trim().replace(/\D/g, '');
            if (floatCall) floatCall.href = `tel:${primaryPhone}`;
            if (floatWa) floatWa.href = `https://wa.me/${primaryPhone}`;
        }
    }

    applyCompanySettings();

    // Inject Favicon if missing
    if (!document.querySelector('link[rel="icon"]')) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = 'assets/images/logo.svg';
        document.head.appendChild(link);
    }
});

// Google Translate Initialization (Moved to global for all pages)
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ta',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Global script to load Google Translate
(function() {
    if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    }
})();
