// ── PRODUCT DATA ──────────────────────────────────────────────
const products = [
  // Electronics
  { id: 1, category: 'electronics', emoji: '📱', brand: 'Apple', name: 'iPhone 16 Pro Max 1TB 티타늄', price: 2190000, original: 2490000, rating: 4.9, reviews: 12483, shipping: '당일 특급배송 (블랙카드 무료)', badge: 'VIP 전용' },
  { id: 2, category: 'electronics', emoji: '💻', brand: 'Apple', name: 'MacBook Pro 16" M4 Max 128GB', price: 5990000, original: 6490000, rating: 4.9, reviews: 5821, shipping: '내일 도착 보장', badge: null },
  { id: 3, category: 'electronics', emoji: '📺', brand: 'Samsung', name: 'Neo QLED 8K 98인치 스마트TV', price: 18900000, original: 22000000, rating: 4.8, reviews: 2341, shipping: '당일 특급배송 (블랙카드 무료)', badge: '14%↓' },
  { id: 4, category: 'electronics', emoji: '🎧', brand: 'Sony', name: 'WH-1000XM6 노이즈캔슬링 헤드폰', price: 480000, original: 549000, rating: 4.8, reviews: 34209, shipping: '당일 특급배송 (블랙카드 무료)', badge: null },
  { id: 5, category: 'electronics', emoji: '⌚', brand: 'Apple', name: 'Apple Watch Ultra 3 49mm 티타늄', price: 1290000, original: 1390000, rating: 4.7, reviews: 8903, shipping: '내일 도착 보장', badge: null },
  // Fashion
  { id: 6, category: 'fashion', emoji: '👜', brand: 'Hermès', name: 'Birkin 30 Togo 가죽 핸드백', price: 22000000, original: 25000000, rating: 5.0, reviews: 312, shipping: '전용 쿠리어 배송 (무료)', badge: 'LUXURY' },
  { id: 7, category: 'fashion', emoji: '👟', brand: 'Louis Vuitton', name: 'LV Trainer 스니커즈 한정판', price: 1850000, original: 2100000, rating: 4.9, reviews: 1209, shipping: '당일 특급배송 (블랙카드 무료)', badge: 'LIMITED' },
  { id: 8, category: 'fashion', emoji: '🧥', brand: 'Moncler', name: '다운 재킷 Gamme Bleu 에디션', price: 3200000, original: 3800000, rating: 4.8, reviews: 891, shipping: '내일 도착 보장', badge: null },
  { id: 9, category: 'fashion', emoji: '🕶️', brand: 'Cartier', name: '빠떼 드 뤼스 선글라스 18K 골드', price: 4500000, original: 5200000, rating: 4.9, reviews: 445, shipping: '전용 쿠리어 배송 (무료)', badge: 'LUXURY' },
  // Car
  { id: 10, category: 'car', emoji: '🚗', brand: 'Ferrari', name: 'Ferrari Roma Spider — 드라이빙 체험 1일', price: 5000000, original: 7000000, rating: 5.0, reviews: 89, shipping: '당일 예약 확정', badge: 'VIP 전용' },
  { id: 11, category: 'car', emoji: '🚙', brand: 'Lamborghini', name: 'Urus S 4WD — 구매 계약 패키지', price: 490000000, original: 520000000, rating: 5.0, reviews: 23, shipping: '계약 후 3개월 내 인도', badge: 'SPECIAL' },
  { id: 12, category: 'car', emoji: '🏎️', brand: 'Porsche', name: 'Porsche 911 GT3 RS 전용 부품 세트', price: 8900000, original: 9800000, rating: 4.9, reviews: 312, shipping: '3일 내 배송', badge: null },
  // Travel
  { id: 13, category: 'travel', emoji: '✈️', brand: 'Singapore Airlines', name: '싱가포르항공 스위트석 서울→파리 왕복', price: 18000000, original: 22000000, rating: 5.0, reviews: 2103, shipping: '즉시 발권', badge: 'VIP 전용' },
  { id: 14, category: 'travel', emoji: '🏨', brand: 'Aman', name: '아만안자 모로코 5박 스위트룸 패키지', price: 25000000, original: 32000000, rating: 5.0, reviews: 512, shipping: '즉시 예약 확정', badge: 'LUXURY' },
  { id: 15, category: 'travel', emoji: '🛥️', brand: 'Sunseeker', name: '지중해 요트 전세 7일 (12인용)', price: 120000000, original: 150000000, rating: 5.0, reviews: 67, shipping: '출발 일정 조율', badge: 'EXCLUSIVE' },
  // Jewelry
  { id: 16, category: 'jewelry', emoji: '💎', brand: 'Tiffany', name: 'Tiffany T True 18K 골드 브레이슬렛', price: 4800000, original: 5500000, rating: 4.9, reviews: 2301, shipping: '당일 특급배송 (블랙카드 무료)', badge: null },
  { id: 17, category: 'jewelry', emoji: '💍', brand: 'Cartier', name: 'Cartier Love 링 18K 화이트골드 다이아', price: 8900000, original: 10200000, rating: 5.0, reviews: 1823, shipping: '전용 쿠리어 배송 (무료)', badge: 'LUXURY' },
  { id: 18, category: 'jewelry', emoji: '⌚', brand: 'Rolex', name: 'Rolex Daytona 18K 옐로우골드 다이아 베젤', price: 89000000, original: 100000000, rating: 5.0, reviews: 934, shipping: '전용 쿠리어 배송 (무료)', badge: 'RARE' },
];

const flashDeals = [
  { emoji: '🍾', name: 'Dom Pérignon 2013', price: 380000, discount: '30%' },
  { emoji: '🎁', name: 'VIP 선물 세트', price: 990000, discount: '20%' },
  { emoji: '🥩', name: '와규 A5 1kg 세트', price: 280000, discount: '25%' },
  { emoji: '🌹', name: '프리미엄 꽃다발 100송이', price: 150000, discount: '15%' },
  { emoji: '🍫', name: 'La Maison 초콜릿 럭셔리 박스', price: 98000, discount: '10%' },
  { emoji: '🕯️', name: 'Diptyque 캔들 컬렉션', price: 180000, discount: '18%' },
];

// ── STATE ──────────────────────────────────────────────────────
let cart = [];
let filteredProducts = [...products];
let currentOrderId = null;

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  renderFlashDeals();
  startCountdown();
});

// ── RENDER ─────────────────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      ${p.badge ? `<div class="product-badge ${p.badge === 'VIP 전용' || p.badge === 'LUXURY' ? 'gold' : ''}">${p.badge}</div>` : ''}
      <div class="product-thumb">${p.emoji}</div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">⭐ ${p.rating} <span>(${p.reviews.toLocaleString()}개 리뷰)</span></div>
        <div class="product-price-row">
          <div class="product-price">₩${p.price.toLocaleString()}</div>
          <div class="product-original">₩${p.original.toLocaleString()}</div>
          <div class="product-discount">${Math.round((1 - p.price / p.original) * 100)}%↓</div>
        </div>
        <div class="product-shipping">💳 ${p.shipping}</div>
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart(${p.id})">🛒 담기</button>
          <button class="btn-buy" onclick="buyNow(${p.id})">바로 구매</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFlashDeals() {
  document.getElementById('flashDeals').innerHTML = flashDeals.map(f => `
    <div class="flash-item" onclick="alert('🔥 특가 상품이 장바구니에 담겼습니다!')">
      <div class="flash-thumb">${f.emoji}</div>
      <div class="flash-info">
        <div class="flash-name">${f.name}</div>
        <div class="flash-price">₩${f.price.toLocaleString()} <span class="flash-discount">${f.discount}</span></div>
      </div>
    </div>
  `).join('');
}

// ── COUNTDOWN ──────────────────────────────────────────────────
function startCountdown() {
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  setInterval(() => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) { document.getElementById('countdown').textContent = '00:00:00'; return; }
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ── SEARCH & FILTER ────────────────────────────────────────────
function searchProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const result = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  );
  renderProducts(result);
  document.getElementById('categoryTitle').textContent = `"${q}" 검색 결과 (${result.length}개)`;
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchProducts();
});

function filterCategory(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const catNames = { all: '전체 상품', electronics: '전자제품', fashion: '패션/명품', car: '자동차', travel: '여행/호텔', jewelry: '주얼리' };
  document.getElementById('categoryTitle').textContent = catNames[cat] || '전체 상품';
  filteredProducts = cat === 'all' ? [...products] : products.filter(p => p.category === cat);
  renderProducts(filteredProducts);
}

function sortProducts(by) {
  const sorted = [...filteredProducts];
  if (by === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (by === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (by === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  renderProducts(sorted);
}

// ── CART ───────────────────────────────────────────────────────
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  showCartToast(p.name);
}

function buyNow(id) {
  cart = [];
  addToCart(id);
  openCheckout();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById('cartCount').textContent = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById('cartTotal').textContent = '₩' + total.toLocaleString();
  document.getElementById('cartItems').innerHTML = cart.length === 0
    ? '<div style="text-align:center;color:#aaa;padding:40px">장바구니가 비어있습니다</div>'
    : cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
          </div>
        </div>
        <span class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</span>
      </div>
    `).join('');
}

function showCartToast(name) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#c9a84c;padding:12px 24px;border-radius:12px;font-weight:700;z-index:9999;font-size:14px;border:1px solid #c9a84c;animation:slideUp .3s ease';
  t.textContent = `✅ "${name.slice(0, 20)}..." 장바구니 추가!`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ── CHECKOUT ───────────────────────────────────────────────────
function goToCheckout() {
  if (cart.length === 0) return alert('장바구니가 비어있습니다');
  toggleCart();
  openCheckout();
}

function openCheckout() {
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById('payAmount').textContent = total.toLocaleString();
  document.getElementById('checkoutSummary').innerHTML = `
    ${cart.map(item => `
      <div class="checkout-summary-item">
        <span>${item.emoji} ${item.name.slice(0, 24)}... × ${item.qty}</span>
        <span>₩${(item.price * item.qty).toLocaleString()}</span>
      </div>
    `).join('')}
    <hr style="margin:10px 0;border:none;border-top:1px solid #eee">
    <div class="checkout-summary-item" style="font-weight:800">
      <span>💳 블랙카드 결제 총액</span>
      <span style="color:#c9a84c">₩${total.toLocaleString()}</span>
    </div>
    <div class="checkout-summary-item" style="color:#2ecc71;font-size:12px">
      <span>✈️ 배송비</span><span>무료 (블랙카드 혜택)</span>
    </div>
  `;
  document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
}

async function placeOrder() {
  const address = document.getElementById('addressInput').value.trim();
  const recipient = document.getElementById('recipientInput').value.trim();
  if (!address || !recipient) { alert('배송지와 받는 분을 입력해주세요'); return; }

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  const btn = document.querySelector('.confirm-btn');
  btn.textContent = '결제 처리 중...';
  btn.disabled = true;

  await new Promise(r => setTimeout(r, 1200));

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total, address: `${address} (${recipient})` }),
    });
    const data = await res.json();
    currentOrderId = data.orderId;

    closeCheckout();
    cart = [];
    updateCartUI();

    document.getElementById('orderIdDisplay').textContent = currentOrderId;
    document.getElementById('successOverlay').classList.add('open');
  } catch (e) {
    alert('결제 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    btn.textContent = '결제 완료 ₩' + document.getElementById('payAmount').textContent;
    btn.disabled = false;
  }
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('open');
}

// ── TRACKING ───────────────────────────────────────────────────
function goToTracking() {
  document.getElementById('successOverlay').classList.remove('open');
  showTrackingPage(currentOrderId);
}

function backToShop() {
  document.getElementById('trackingPage').classList.add('hidden');
}

async function showTrackingPage(orderId) {
  document.getElementById('trackingPage').classList.remove('hidden');
  document.getElementById('trackingTimeline').innerHTML = '<div style="text-align:center;padding:40px;color:#aaa">로딩 중...</div>';
  await refreshTracking(orderId);
}

async function refreshTracking(orderId) {
  const id = orderId || currentOrderId;
  if (!id) return;
  try {
    const res = await fetch(`/api/order/${id}`);
    if (!res.ok) { alert('주문을 찾을 수 없습니다'); return; }
    const order = await res.json();
    renderTrackingPage(order);
  } catch (e) {
    alert('조회 오류가 발생했습니다.');
  }
}

function renderTrackingPage(order) {
  const currentStage = order.stages.find(s => s.current);

  document.getElementById('trackingOrderInfo').innerHTML = `
    <p><strong>주문번호</strong> &nbsp;${order.orderId}</p>
    <p><strong>배송지</strong> &nbsp;${order.address}</p>
    <p><strong>현재 상태</strong> &nbsp;<span style="color:var(--gold);font-weight:800">${currentStage?.label || '확인 중'}</span></p>
    <p><strong>결제 금액</strong> &nbsp;₩${order.total.toLocaleString()} (블랙카드 자동 결제)</p>
  `;

  document.getElementById('trackingTimeline').innerHTML = `
    <h3 style="margin-bottom:20px;font-size:16px;font-weight:800">배송 현황</h3>
    ${order.stages.map(s => `
      <div class="timeline-item ${s.done ? 'done' : ''} ${s.current ? 'current' : ''}">
        <div class="timeline-dot">${s.done ? s.icon : '○'}</div>
        <div class="timeline-info">
          <div class="timeline-label">
            ${s.label}
            ${s.current ? '<span class="timeline-current-badge">현재</span>' : ''}
          </div>
          ${s.time ? `<div class="timeline-time">${s.time}</div>` : ''}
        </div>
      </div>
    `).join('')}
  `;

  document.getElementById('trackingItems').innerHTML = `
    <h3>주문 상품</h3>
    ${order.items.map(item => `
      <div class="tracking-item">
        <div class="tracking-item-emoji">${item.emoji}</div>
        <div class="tracking-item-name">${item.name} × ${item.qty}</div>
        <div class="tracking-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('')}
  `;
}

// ── CARD MODAL ─────────────────────────────────────────────────
function showCardModal() {
  document.getElementById('cardModalOverlay').classList.add('open');
}
function closeCardModal() {
  document.getElementById('cardModalOverlay').classList.remove('open');
}
document.getElementById('cardModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('cardModalOverlay')) closeCardModal();
});
document.getElementById('checkoutOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
});
document.getElementById('successOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('successOverlay')) closeSuccess();
});
