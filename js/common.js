// Language Translation Trigger using Cookies and Hash
function translatePage(langCode) {
    // 1. Set Google Translate Cookie aggressively
    const host = window.location.hostname;
    const cookieValue = `/en/${langCode}`;
    
    // Domain variants for broad coverage
    const domains = [host, `www.${host}`];
    const parts = host.split('.');
    if (parts.length >= 2) domains.push(`.${parts.slice(-2).join('.')}`);
    
    domains.forEach(d => {
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${d};`;
        if (d.startsWith('.')) {
             document.cookie = `googtrans=${cookieValue}; path=/; domain=${d.substring(1)};`;
        }
    });
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    
    // 2. Save Preference locally
    localStorage.setItem('preferredLanguage', langCode);
    
    // 3. Update Hash for Google Translate fallback
    window.location.hash = `#googtrans(en|${langCode})`;
    
    // 4. Update UI
    updateLangUI(langCode);

    // 5. Reload page WITH a URL parameter to force it
    const url = new URL(window.location.href);
    url.searchParams.set('lang', langCode);
    window.location.href = url.toString();
}

function updateLangUI(langCode) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.add('notranslate'); // Prevent Google from translating the buttons
        const text = btn.textContent.trim().toUpperCase();
        if (langCode === 'en' && (text.includes('ENGLISH') || text === 'EN')) {
            btn.classList.add('active');
        } else if (langCode === 'ta' && (text.includes('தமிழ்') || text === 'TA')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize translation styling and force check on load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URL(window.location.href).searchParams;
    const urlLang = urlParams.get('lang');
    // Check hash as well
    const hashLang = window.location.hash.includes('ta') ? 'ta' : (window.location.hash.includes('en') ? 'en' : null);
    
    const savedLang = urlLang || hashLang || localStorage.getItem('preferredLanguage') || 'en';
    
    if (urlLang || hashLang) {
        localStorage.setItem('preferredLanguage', urlLang || hashLang);
    }

    updateLangUI(savedLang);

    // Polling: Force update the Google Translate widget if it appears
    if (savedLang !== 'en') {
        const interval = setInterval(() => {
            const combo = document.querySelector('.goog-te-combo');
            if (combo) {
                if (combo.value !== savedLang) {
                    combo.value = savedLang;
                    combo.dispatchEvent(new Event('change', { bubbles: true }));
                    combo.dispatchEvent(new Event('click', { bubbles: true }));
                }
                clearInterval(interval);
            }
        }, 500);
        setTimeout(() => clearInterval(interval), 15000); // 15s extended polling
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
        
        // Update Brand Logo
        if (settings.logo_url) {
            document.querySelectorAll('.logo img').forEach(img => {
                img.src = settings.logo_url;
            });
            // Update Favicon
            let favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = settings.logo_url;
            } else {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                favicon.href = settings.logo_url;
                document.head.appendChild(favicon);
            }
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

// Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ta,en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: true
    }, 'google_translate_element');

    // Special check for immediate trigger on init
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        const checkExist = setInterval(() => {
            const combo = document.querySelector('.goog-te-combo');
            if (combo) {
                combo.value = savedLang;
                combo.dispatchEvent(new Event('change', { bubbles: true }));
                clearInterval(checkExist);
            }
        }, 200);
        setTimeout(() => clearInterval(checkExist), 5000);
    }
}

// Global script to load Google Translate
(function() {
    // 1. Create the container div immediately if it doesn't exist
    if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none';
        div.style.position = 'fixed';
        div.style.bottom = '0';
        div.style.left = '0';
        div.style.zIndex = '-1000';
        document.body.appendChild(div);
    }

    // 2. Clear old scripts to prevent conflicts during re-runs
    document.querySelectorAll('script[src*="translate.google.com"]').forEach(s => s.remove());

    // 3. Dynamic Load
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    // Add error handling for local files
    script.onerror = () => {
        console.warn('Google Translate failed to load. This usually happens on local "file:///" protocols. Please use a local server (Live Server) for full functionality.');
    };
    
    document.head.appendChild(script);
})();
