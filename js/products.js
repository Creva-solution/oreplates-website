// Product Data and UI Logic
// Product Data and UI Logic

async function renderProducts(filter = 'All') {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top: 1rem;">Loading our collection...</p></div>';
    
    let productsList = [];
    
    try {
        // Fetch from Supabase
        const { data, error } = await window.supabaseInstance
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
            productsList = data.map(p => ({
                id: p.id,
                name: p.name,
                size: p.size,
                plateCount: p.plate_count,
                description: p.description,
                category: p.category,
                image: p.image_url || 'assets/images/logo.svg',
                originalPrice: parseFloat(p.price),
                offerPrice: p.discount_percent > 0 ? p.price * (1 - p.discount_percent/100) : null,
                enableOffer: p.discount_percent > 0,
                discountPercent: p.discount_percent || 0,
                inStock: !p.is_out_of_stock
            }));
        }
    } catch (err) {
        console.error('Supabase fetch failed:', err);
    }

    container.innerHTML = '';
    
    if (productsList.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #64748b;"><i class="fas fa-box-open fa-3x" style="color: #cbd5e1; margin-bottom: 1rem;"></i><h3 style="font-size: 1.5rem; color: var(--primary-dark);">Products coming soon</h3><p>We are currently updating our catalog.</p></div>';
        return;
    }

    const filtered = filter === 'All' ? productsList : productsList.filter(p => p.category === filter);

    filtered.forEach(product => {
        const hasOffer = product.enableOffer && product.offerPrice;
        const discountPercent = product.discountPercent || (hasOffer ? Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100) : 0);
        const isOutOfStock = product.inStock === false;

        const packMultiplier = product.plateCount || 1;
        const packOriginalPrice = product.originalPrice * packMultiplier;
        const packOfferPrice = product.offerPrice ? product.offerPrice * packMultiplier : null;

        const card = `
            <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); position: relative; height: 100%; display: flex; flex-direction: column;" data-aos="fade-up">
                <!-- Product Image Area -->
                <div style="height: 220px; background: #f8fafc url('${product.image}'); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; position: relative;">
                    ${hasOffer ? `<span class="discount-badge" style="position: absolute; top: 1rem; right: 1rem;">${discountPercent}% OFF</span>` : ''}
                    ${isOutOfStock ? `<span style="position: absolute; top: 1rem; left: 1rem; background: #ef4444; color: white; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; z-index: 10;">Out of Stock</span>` : ''}
                    
                    <!-- Quick Share Float -->
                    <div class="share-float">
                        <a href="https://wa.me/?text=${encodeURIComponent('Check out this ' + product.name + ' at Oreplates: ' + window.location.href)}" class="share-icon-mini" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" class="share-icon-mini" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <button class="share-icon-mini" onclick="copyLink('${product.name}')" title="Copy Link"><i class="fas fa-link"></i></button>
                    </div>
                </div>
                
                <!-- Product Info Area -->
                <div style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; ${isOutOfStock ? 'opacity: 0.7;' : ''}">
                    <!-- Category Label -->
                    <span style="display: block; font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">${product.category}</span>
                    
                    <!-- Product Title -->
                    <h3 style="margin: 0; font-size: 1.25rem; color: var(--text); line-height: 1.3;">${product.name}</h3>
                    
                    <!-- Size Information -->
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0 0.2rem;">Available Size: ${product.size}</p>
                    ${product.plateCount ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin: 0 0 1rem; font-weight: 600;">Pack: ${product.plateCount} Plates</p>` : `<div style="height: 1rem; margin-bottom: 1rem;"></div>`}
                    
                    ${hasOffer ? '<span class="special-offer-lbl" style="align-self: flex-start;">Special Offer</span>' : ''}
                    
                    <!-- Price Section (One Line) -->
                    <div class="price-section" style="margin-bottom: 1.5rem; display: flex; align-items: baseline; gap: 8px;">
                        ${hasOffer ? `
                            <span class="offer-price" style="font-size: 1.4rem; color: var(--primary); font-weight: 800;">₹${packOfferPrice.toFixed(2).replace(/\.00$/, '')}</span>
                            <span class="original-price" style="font-size: 0.95rem; color: var(--text-muted); text-decoration: line-through; opacity: 0.6;">₹${packOriginalPrice.toFixed(2).replace(/\.00$/, '')}</span>
                        ` : `
                            <span class="offer-price" style="font-size: 1.4rem; color: var(--primary); font-weight: 800;">₹${packOriginalPrice.toFixed(2).replace(/\.00$/, '')}</span>
                        `}
                    </div>

                    <!-- Action Buttons -->
                    <div class="product-card-buttons" style="margin-top: auto;">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline" style="flex: 1;">Details</a>
                        ${isOutOfStock ? 
                            `<button class="btn" disabled style="flex: 1; background: #cbd5e1; color: #64748b; cursor: not-allowed;">Unavailable</button>` :
                            `<a href="order.html?product=${encodeURIComponent(product.name)}&size=${encodeURIComponent(product.size)}&price=${hasOffer ? packOfferPrice : packOriginalPrice}&pack=${product.plateCount}" class="btn btn-primary" style="flex: 1;">Order Now</a>`
                        }
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function orderViaWhatsApp(productName) {
    const message = encodeURIComponent(`Hello Oreplates,\n\nI am interested in ordering: ${productName}.\n\nPlease provide more details.`);
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
}

function copyLink(pName) {
    const url = window.location.href;
    navigator.clipboard.writeText(`Check out ${pName} at Oreplates: ${url}`).then(() => {
        alert('Product link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await renderProducts();
});
