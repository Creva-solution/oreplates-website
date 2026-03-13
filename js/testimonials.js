// Testimonials Loading Logic
async function loadTestimonials() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    try {
        const { data: testimonials, error } = await window.supabaseInstance
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!testimonials || testimonials.length === 0) {
            track.innerHTML = '<div style="padding: 2rem; color: rgba(255,255,255,0.4); text-align: center; width: 100%;">Be the first to share your experience!</div>';
            return;
        }

        track.innerHTML = '';
        
        // Generate Cards
        const cardsHTML = testimonials.map(t => {
            const initials = t.name ? t.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
            const avatarHTML = t.avatar_url 
                ? `<img src="${t.avatar_url}" alt="${t.name}">`
                : `<div class="avatar-circle">${initials}</div>`;
                
            return `
                <div class="testimonial-card-small">
                    <p class="quote">"${t.review || ''}"</p>
                    <div class="author-info">
                        <div class="avatar-cont">
                            ${avatarHTML}
                        </div>
                        <div class="meta">
                            <h4>${t.name || 'Anonymous'}</h4>
                            <p>${t.title || 'Customer'}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Inject twice for seamless marquee loop
        track.innerHTML = cardsHTML + cardsHTML;

    } catch (err) {
        console.error('Testimonials load error:', err);
        track.innerHTML = '<div style="padding: 2rem; color: rgba(255,255,255,0.4); text-align: center; width: 100%;">New testimonials coming soon.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadTestimonials);
