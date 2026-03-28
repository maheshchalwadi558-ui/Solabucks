/**
 * Solabucks - Main JavaScript
 * Handles: Cart, Login, Register, Order submission
 */

const API_URL = 'http://localhost:5000/api';

// ============ CART ============
let cart = JSON.parse(localStorage.getItem('solabucks_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('solabucks_user') || 'null');

function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
    updateCartUI();
}

function updateCartItem(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(name);
    else saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('solabucks_cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const cartNav = document.getElementById('cartNav');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');

    if (countEl) {
        const count = cart.reduce((s, i) => s + i.quantity, 0);
        countEl.textContent = count;
    }
    if (cartNav) {
        cartNav.style.display = cart.length ? 'inline-block' : 'none';
    }
    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="cart-empty">Add items from the menu above.</p>';
        } else {
            cartItemsList.innerHTML = cart.map(item => {
                const safeName = item.name.replace(/"/g, '&quot;');
                return `<div class="cart-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <div class="cart-item-actions">
                        <button data-action="update" data-name="₹${safeName}" data-delta="-1">−</button>
                        <button data-action="update" data-name="₹${safeName}" data-delta="1">+</button>
                        <button class="remove-btn" data-action="remove" data-name="₹${safeName}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
            }).join('');
            cartItemsList.querySelectorAll('[data-action="update"]').forEach(btn => {
                btn.addEventListener('click', () => updateCartItem(btn.dataset.name, parseInt(btn.dataset.delta)));
            });
            cartItemsList.querySelectorAll('[data-action="remove"]').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(btn.dataset.name));
            });
        }
    }
    if (cartTotal) {
       cartTotal.textContent = 'Total: ₹' + getCartTotal().toFixed(2);
    }
}

// ============ LOGIN / REGISTER ============
document.addEventListener('DOMContentLoaded', function() {
    // Pre-fill order form if user is logged in
    if (currentUser) {
        const orderName = document.getElementById('orderName');
        const orderEmail = document.getElementById('orderEmail');
        const orderPhone = document.getElementById('orderPhone');
        if (orderName) orderName.value = currentUser.name;
        if (orderEmail) orderEmail.value = currentUser.email;
        if (orderPhone) orderPhone.value = currentUser.phone || '';
    }

    updateCartUI();

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errEl = document.getElementById('loginError');
            const btn = document.getElementById('loginBtn');
            errEl.textContent = '';
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: document.getElementById('loginEmail').value,
                        password: document.getElementById('loginPassword').value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('solabucks_user', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                } else {
                    errEl.textContent = data.message || 'Login failed';
                }
            } catch (err) {
                errEl.textContent = 'Cannot connect to server. Is the backend running?';
            }
            btn.disabled = false;
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errEl = document.getElementById('registerError');
            const btn = document.getElementById('registerBtn');
            errEl.textContent = '';
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: document.getElementById('regName').value,
                        email: document.getElementById('regEmail').value,
                        phone: document.getElementById('regPhone').value,
                        password: document.getElementById('regPassword').value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    errEl.style.color = 'green';
                    errEl.textContent = data.message;
                    registerForm.reset();
                } else {
                    errEl.style.color = '#dc3545';
                    errEl.textContent = data.message || 'Registration failed';
                }
            } catch (err) {
                errEl.textContent = 'Cannot connect to server. Is the backend running?';
            }
            btn.disabled = false;
        });
    }

    // Order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                document.getElementById('responseMessage').textContent = 'Please add items to your cart first.';
                document.getElementById('responseMessage').style.color = '#dc3545';
                return;
            }
            const msgEl = document.getElementById('responseMessage');
            const btn = document.getElementById('placeOrderBtn');
            msgEl.textContent = '';
            btn.disabled = true;
            try {
                const payload = {
                    customer_name: document.getElementById('orderName').value,
                    customer_email: document.getElementById('orderEmail').value,
                    customer_phone: document.getElementById('orderPhone').value,
                    notes: document.getElementById('orderNotes').value || '',
                    items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))
                };
                if (currentUser) payload.user_id = currentUser.id;

                const res = await fetch(API_URL + '/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    cart = [];
                    saveCart();
                    updateCartUI();
                    window.location.href = 'order_received.html?order_id=' + data.order_id;
                } else {
                    msgEl.textContent = data.message || 'Order failed';
                    msgEl.style.color = '#dc3545';
                }
            } catch (err) {
                msgEl.textContent = 'Cannot connect to server. Make sure the Python backend is running on port 5000.';
                msgEl.style.color = '#dc3545';
            }
            btn.disabled = false;
        });
    }

    // Cart nav click - go to order page
    const cartNav = document.getElementById('cartNav');
    if (cartNav) {
        cartNav.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'order.html';
        });
    }

    // Hamburger menu (mobile)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }
});
