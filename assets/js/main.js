document.addEventListener('DOMContentLoaded', () => {
    // Navigation highlight
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            // Check if it's index.html or root
            if ((currentPath === '' || currentPath === 'index.html') && link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });

    // Mobile Navigation
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Product Filter Logic (for products.html)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                filterBtns.forEach(b => b.classList.remove('btn-primary'));
                filterBtns.forEach(b => b.classList.add('btn-secondary'));

                // Add active to clicked
                btn.classList.add('active');
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-secondary');

                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Lightbox Logic (for gallery.html)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Check if item has an image, if not ignore (for placeholders)
                const img = item.querySelector('img');
                if (img) {
                    lightbox.classList.add('active');
                    lightboxImg.src = img.src;
                } else {
                    // For text placeholders, we might want to skip or show something else
                    // For now, doing nothing or logging
                    console.log('No image in clicked gallery item');
                }
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
});

// Multi-Language Support
const translations = {
    en: {
        "nav_home": "Home",
        "nav_products": "Products",
        "nav_about": "About",
        "nav_why": "Why ORE?",
        "nav_gallery": "Gallery",
        "nav_contact": "Contact",
        "btn_bulk": "Bulk Order",
        "ph_name": "Your Name",
        "ph_email": "Your Email",
        "ph_phone": "Your Phone Number",
        "ph_location": "Your Location",
        "ph_message": "Message / Products Required",
        "btn_submit": "Send Message",
        "hero_eyebrow": "100% Natural & Sustainable",
        "hero_title": "Eco-Friendly Areca Leaf Plates<br>for a Responsible Earth",
        "hero_desc": "Natural • Chemical-Free • Compostable • Heat Resistant. <br>Directly from our factory in Kallakurichi, Tamil Nadu.",
        "btn_explore": "Explore Products",
        "btn_quote": "Request Quote",
        "h2_bestsellers": "Our Best Sellers",
        "p_craft": "Crafted from nature, designed for durability.",
        "cat_round": "Round Plates",
        "cat_square": "Square Plates",
        "cat_partition": "Partition Plates",
        "h4_ore": "ORE Plates",
        "p_footer_desc": "Our Responsible Earth. Manufacturing high-quality, eco-friendly areca leaf plates since 2024.",
        "h4_quicklinks": "Quick Links",
        "h4_contact": "Contact",
        "p_rights": "&copy; 2024 ORE Plates. All rights reserved.",
        "badge_exp": "14+ Years Experience",
        "about_title": "14 Years of Areca Plate Craftsmanship",
        "about_sub": "Sustainable • Natural • Responsible",
        "stats_experience": "Years",
        "stats_output": "Daily Output",
        "stats_team": "Team",
        "legacy_section": "Our Legacy",
        "operations_section": "Our Operations",
        "btn_more": "Learn More"
    },
    ta: {
        "nav_home": "முகப்பு",
        "nav_products": "தயாரிப்புகள்",
        "nav_about": "எங்களை பற்றி",
        "nav_why": "ஏன் ORE?",
        "nav_gallery": "கேலரி",
        "nav_contact": "தொடர்பு",
        "btn_bulk": "மொத்த ஆர்டர்",
        "ph_name": "உங்கள் பெயர்",
        "ph_email": "உங்கள் மின்னஞ்சல்",
        "ph_phone": "உங்கள் தொலைபேசி",
        "ph_location": "உங்கள் இடம்",
        "ph_message": "தகவல் / தேவையான பொருட்கள்",
        "btn_submit": "செய்தியை அனுப்பவும்",
        "hero_eyebrow": "100% இயற்கை & நிலையான",
        "hero_title": "பசுமை பூமிக்கான<br>இயற்கை பாக்குமட்டை தட்டுகள்",
        "hero_desc": "இயற்கையானது • ரசாயனமற்றது • மக்கும் தன்மை • வெப்பம் தாங்கக்கூடியது.<br>கள்ளக்குறிச்சியில் உள்ள எங்கள் தொழிற்சாலையிலிருந்து நேரடியாக.",
        "btn_explore": "தயாரிப்புகள்",
        "btn_quote": "விலை கேட்க",
        "h2_bestsellers": "எங்கள் சிறந்த விற்பனை",
        "p_craft": "இயற்கையிலிருந்து வடிவமைக்கப்பட்டது, உறுதிக்கு உத்தரவாதம்.",
        "cat_round": "வட்ட தட்டுகள்",
        "cat_square": "சதுர தட்டுகள்",
        "cat_partition": "பிரிவு தட்டுகள்",
        "h4_ore": "ORE தட்டுகள்",
        "p_footer_desc": "எங்கள் பொறுப்பான பூமி. 2024 முதல் உயர்தர, சுற்றுச்சூழலுக்கு உகந்த பாக்குமட்டை தட்டுகளை உற்பத்தி செய்கிறோம்.",
        "h4_quicklinks": "விரைவு இணைப்புகள்",
        "h4_contact": "தொடர்பு",
        "p_rights": "&copy; 2024 ORE Plates. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
        "badge_exp": "14+ ஆண்டுகள் அனுபவம்",
        "about_title": "14 வருடங்கள் பாக்குமட்டைத் தட்டு உற்பத்தி",
        "about_sub": "திடமானது • இயற்கை • பொறுப்பானது",
        "stats_experience": "ஆண்டுகள்",
        "stats_output": "நாள் உற்பத்தி",
        "stats_team": "அணி",
        "legacy_section": "எங்கள் பாரம்பரியம்",
        "operations_section": "எங்கள் செயல்பாடுகள்",
        "btn_more": "மேலும் அறிக"
    }
};

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Update active state in selector
    const btnEn = document.getElementById('lang-en');
    const btnTa = document.getElementById('lang-ta');
    if (btnEn && btnTa) {
        if (lang === 'en') {
            btnEn.style.fontWeight = 'bold';
            btnTa.style.fontWeight = 'normal';
        } else {
            btnEn.style.fontWeight = 'normal';
            btnTa.style.fontWeight = 'bold';
        }
    }

    // Save preference
    localStorage.setItem('ore_lang', lang);
}

// Initialize Language
document.addEventListener('DOMContentLoaded', () => {
    // ... existing init ...
    const savedLang = localStorage.getItem('ore_lang') || 'en';
    changeLanguage(savedLang);

    const btnEn = document.getElementById('lang-en');
    const btnTa = document.getElementById('lang-ta');
    if (btnEn) btnEn.addEventListener('click', () => changeLanguage('en'));
    if (btnTa) btnTa.addEventListener('click', () => changeLanguage('ta'));
});

