/* ═══════════════════════════════════════════
   LUNARIS CART SYSTEM
   Include this file in every HTML page:
   <script src="cart.js"></script>
════════════════════════════════════════════ */

const WHATSAPP_NUMBER = "213779724156"; // your number, 213 = Algeria country code

const WILAYAS = [
  "01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi",
  "05 - Batna","06 - Béjaïa","07 - Biskra","08 - Béchar",
  "09 - Blida","10 - Bouira","11 - Tamanrasset","12 - Tébessa",
  "13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou","16 - Alger",
  "17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda",
  "21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma",
  "25 - Constantine","26 - Médéa","27 - Mostaganem","28 - M'Sila",
  "29 - Mascara","30 - Ouargla","31 - Oran","32 - El Bayadh",
  "33 - Illizi","34 - Bordj Bou Arréridj","35 - Boumerdès","36 - El Tarf",
  "37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela",
  "41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla",
  "45 - Naâma","46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane",
  "49 - Timimoun","50 - Bordj Badji Mokhtar","51 - Ouled Djellal",
  "52 - Béni Abbès","53 - In Salah","54 - In Guezzam",
  "55 - Touggourt","56 - Djanet","57 - El M'Ghair","58 - El Meniaa"
];

// ── Cart state
let cart = JSON.parse(localStorage.getItem('lunaris_cart') || '[]');

function saveCart() {
  localStorage.setItem('lunaris_cart', JSON.stringify(cart));
}

// ── Add item to cart
function addToCart(id, name, price, image, size, color) {
  // If called with no arguments (from product pages), read from the page's PRODUCT object
  if (id === undefined && typeof PRODUCT !== 'undefined') {
    id    = PRODUCT.img1; // use image as a unique-enough id
    name  = PRODUCT.name_en;
    price = PRODUCT.price;
    image = PRODUCT.img1;
    size  = document.querySelector('.size-btn.active')?.textContent?.trim()  || '';
    color = document.querySelector('.color-dot.active')?.title?.trim()        || '';
  }

  const existing = cart.find(i => i.id === id && i.size === size && i.color === color);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, size, color, qty: 1 });
  }
  saveCart();
  updateCartUI();
  openCart();

  // flash confirmation
  const msg = document.getElementById('cartMsg');
  if (msg) {
    msg.textContent = `✓ ${name} (${size}, ${color}) added to cart`;
    msg.style.color = '#C8547A';
    setTimeout(() => msg.textContent = '', 3000);
  }
}

// ── Remove item
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  renderCartItems();
}

// ── Change quantity
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    removeFromCart(index);
    return;
  }
  saveCart();
  updateCartUI();
  renderCartItems();
}

// ── Total
function getTotal() {
  return cart.reduce((sum, i) => {
    const price = parseInt(i.price.replace(/[^0-9]/g, ''));
    return sum + price * i.qty;
  }, 0);
}

// ── Update badge
function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const total = cart.reduce((s, i) => s + i.qty, 0);
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

// ── Render cart items
function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:#ccc;fill:none;margin:0 auto 16px;display:block;">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <p style="font-size:12px;color:#bbb;margin-top:4px;">سلتك فارغة</p>
      </div>`;
    if (totalEl) totalEl.textContent = '0 DA';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.style.background='#f0e0e8';this.src=''" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.size} · ${item.color}</div>
        <div class="cart-item-price">${item.price}</div>
        <div class="cart-qty-row">
          <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${i})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  const total = getTotal();
  if (totalEl) totalEl.textContent = total.toLocaleString('fr-DZ') + ' DA';
}

// ── Open / close cart
function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('show');
  renderCartItems();
  showCartView('items'); // always open on items view, not checkout
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

// ── Switch between items view and checkout view
function showCartView(view) {
  const itemsView = document.getElementById('cartItemsView');
  const checkoutView = document.getElementById('cartCheckoutView');
  if (!itemsView || !checkoutView) return;
  if (view === 'items') {
    itemsView.style.display = 'flex';
    checkoutView.style.display = 'none';
  } else {
    itemsView.style.display = 'none';
    checkoutView.style.display = 'flex';
    // populate wilaya dropdown
    const sel = document.getElementById('wilayaSelect');
    if (sel && sel.options.length <= 1) {
      WILAYAS.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        sel.appendChild(opt);
      });
    }
  }
}

// ── Validate and submit order via WhatsApp
function submitOrder() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const wilaya = document.getElementById('wilayaSelect').value;
  const town = document.getElementById('town').value.trim();
  const errors = document.getElementById('formErrors');

  // Validation
  const issues = [];
  if (!fname) issues.push("First name is required");
  if (!lname) issues.push("Last name is required");
  if (!phone || phone.length < 9) issues.push("Valid phone number required");
  if (!wilaya) issues.push("Please select your wilaya");
  if (!town) issues.push("Town name is required");
  if (cart.length === 0) issues.push("Your cart is empty");

  if (issues.length > 0) {
    errors.innerHTML = issues.map(e => `<p>⚠ ${e}</p>`).join('');
    errors.style.display = 'block';
    return;
  }
  errors.style.display = 'none';

  // Build WhatsApp message
  const orderLines = cart.map(item =>
    `• ${item.name} (${item.size}, ${item.color}) x${item.qty} — ${item.price}`
  ).join('\n');

  const total = getTotal().toLocaleString('fr-DZ');

  const message =
`🛍 NEW ORDER — Lunaris
━━━━━━━━━━━━━━━━━━━
👤 ${fname} ${lname}
📞 ${phone}
📍 ${wilaya}, ${town}
━━━━━━━━━━━━━━━━━━━
ORDER:
${orderLines}
━━━━━━━━━━━━━━━━━━━
TOTAL: ${total} DA
━━━━━━━━━━━━━━━━━━━`;

  if (typeof fbq === 'function') {
    fbq('track', 'Lead');
  }

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Open WhatsApp FIRST and synchronously (no setTimeout). This still counts
  // as a direct result of the user's click, so popup blockers let it through.
  // Delaying this call is what was causing silent failures before.
  const waWindow = window.open(url, '_blank');

  const checkoutView = document.getElementById('cartCheckoutView');

  if (waWindow) {
    // WhatsApp actually opened — the order has left the building, safe to empty the cart.
    cart = [];
    saveCart();
    updateCartUI();

    if (checkoutView) {
      checkoutView.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:16px;">✓</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:8px;color:#1a1a1a;">Order Sent!</h3>
          <p style="color:#777;font-size:14px;margin-bottom:8px;">You'll be redirected to WhatsApp to complete your order.</p>
          <p style="color:#C8547A;font-size:13px;direction:rtl;">سيتم تحويلك إلى واتساب لإتمام طلبك</p>
        </div>`;
    }

    setTimeout(closeCart, 1500);
  } else {
    // Popup was blocked — do NOT clear the cart, or the order is lost with no way to recover it.
    if (checkoutView) {
      checkoutView.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:16px;">⚠</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:8px;color:#1a1a1a;">Popup blocked</h3>
          <p style="color:#777;font-size:14px;margin-bottom:16px;">Your browser blocked the WhatsApp window. Tap below to send your order — your cart hasn't been touched.</p>
          <a href="${url}" target="_blank" class="btn-whatsapp" style="text-decoration:none;display:inline-block;padding:12px 24px;">Open WhatsApp</a>
        </div>`;
    }
  }
}

// ── Init on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});