let currentLanguage = 'fa';
let cart = [];
let packsData = { fa: [], en: [] };

// Translations
const translations = {
    fa: {
        "hero-title": "خوش‌آمدید به PackFound",
        "hero-desc": "بهترین پک‌های ماینکرافت را پیدا کنید",
        "hero-btn": "مرور پک‌ها",
        "packs-title": "پک‌های موجود",
        "about-title": "درباره ما",
        "about-text": "ما بهترین و معتبرترین پک‌های ماینکرافت را فراهم می‌کنیم. با ما خرید کنید و تجربه بازی بهتری داشته باشید.",
        "contact-title": "تماس با ما",
        "email-label": "ایمیل:",
        "phone-label": "تلفن:",
        "social-label": "شبکه‌های اجتماعی:",
        "footer-text": "© 2024 PackFound. تمام حقوق محفوظ است.",
        "cart-title": "سبد خرید",
        "empty-cart": "سبد خرید خالی است",
        "total-label": "جمع کل:",
        "checkout-btn": "تکمیل خرید"
    },
    en: {
        "hero-title": "Welcome to PackFound",
        "hero-desc": "Find the best Minecraft packs",
        "hero-btn": "Browse Packs",
        "packs-title": "Available Packs",
        "about-title": "About Us",
        "about-text": "We provide the best and most reliable Minecraft packs. Shop with us and have a better gaming experience.",
        "contact-title": "Contact Us",
        "email-label": "Email:",
        "phone-label": "Phone:",
        "social-label": "Social Media:",
        "footer-text": "© 2024 PackFound. All rights reserved.",
        "cart-title": "Shopping Cart",
        "empty-cart": "Your cart is empty",
        "total-label": "Total:",
        "checkout-btn": "Checkout"
    }
};

// Load packs from JSON
async function loadPacks() {
    try {
        const response = await fetch('packs.json');
        const data = await response.json();
        
        packsData.fa = data.packs.map(pack => ({
            id: pack.id,
            name: pack.name_fa,
            icon: pack.icon,
            description: pack.description_fa,
            price: pack.price
        }));
        
        packsData.en = data.packs.map(pack => ({
            id: pack.id,
            name: pack.name_en,
            icon: pack.icon,
            description: pack.description_en,
            price: pack.price
        }));
        
        renderPacks();
    } catch (error) {
        console.error('خطا در بارگذاری پک‌ها:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPacks();
    document.documentElement.dir = 'rtl';
});

// Switch Language
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update button styles
    document.getElementById('fa-btn').classList.remove('active');
    document.getElementById('en-btn').classList.remove('active');
    document.getElementById(lang + '-btn').classList.add('active');
    
    // Update direction
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';
    
    // Update text
    updateTexts();
    
    // Re-render packs
    renderPacks();
}

// Update all text elements
function updateTexts() {
    const trans = translations[currentLanguage];
    
    for (const [key, value] of Object.entries(trans)) {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    }
}

// Render Packs
function renderPacks() {
    const grid = document.getElementById('packs-grid');
    const packs = packsData[currentLanguage];
    
    grid.innerHTML = '';
    
    packs.forEach(pack => {
        const packCard = document.createElement('div');
        packCard.className = 'pack-card';
        packCard.innerHTML = `
            <div class="pack-icon">${pack.icon}</div>
            <h3>${pack.name}</h3>
            <p>${pack.description}</p>
            <div class="pack-price">${pack.price.toLocaleString('fa-IR')} تومان</div>
            <button class="btn-add-cart" onclick="addToCart(${pack.id}, '${pack.name.replace(/'/g, "\\'")}', '${pack.price}')">
                ${currentLanguage === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}
            </button>
        `;
        grid.appendChild(packCard);
    });
    
    updateTexts();
}

// Add to Cart
function addToCart(id, name, price) {
    const item = {
        id: id,
        name: name,
        price: price
    };
    
    cart.push(item);
    updateCartUI();
    alert(currentLanguage === 'fa' ? 'پک به سبد خرید اضافه شد!' : 'Pack added to cart!');
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<p id="empty-cart">${translations[currentLanguage]['empty-cart']}</p>`;
    } else {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>${parseInt(item.price).toLocaleString('fa-IR')} تومان</span>
                <button onclick="removeFromCart(${index})" style="background: #C41E3A; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    ${currentLanguage === 'fa' ? 'حذف' : 'Remove'}
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    updateTotalPrice();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Update Total Price
function updateTotalPrice() {
    let total = 0;
    cart.forEach(item => {
        total += parseInt(item.price);
    });
    
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = total.toLocaleString('fa-IR') + ' تومان';
}

// Toggle Cart Modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert(currentLanguage === 'fa' ? 'سبد خرید خالی است!' : 'Your cart is empty!');
        return;
    }
    
    alert(currentLanguage === 'fa' ? 'سفارش شما ثبت شد! تشکر از خریداری شما.' : 'Your order has been placed! Thank you for shopping!');
    cart = [];
    updateCartUI();
    toggleCart();
}

// Smooth Scroll
function scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
