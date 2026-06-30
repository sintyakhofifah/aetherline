/* =========================================================
   AETHER LINE — main.js
   Shared utilities loaded on every page: cart storage helpers,
   nav toggle, cart-count badge, toast, WhatsApp link builder.
   ========================================================= */

// TODO: ganti dengan nomor WhatsApp toko Aether Line (format: 62xxxxxxxxxx, tanpa "+" atau "0" di depan)
const WHATSAPP_NUMBER = "6281234567890";

const STORE_ADDRESS = "Gampong Batuphat Timur, Kec. Muara Satu, Kota Lhokseumawe, Aceh";

const CART_KEY = "aether_cart";
const ORDER_KEY = "aether_last_order";

/* ---------- Cart storage helpers (shared across all pages) ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function cartCount(cart) {
  cart = cart || getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal(cart) {
  cart = cart || getCart();
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(item) {
  const cart = getCart();
  // items with a custom design upload are always unique line items
  const existing = !item.customDesign && cart.find(
    (c) => c.id === item.id && c.size === item.size
  );
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

function removeFromCart(lineId) {
  const cart = getCart().filter((c) => c.lineId !== lineId);
  saveCart(cart);
}

function setQty(lineId, qty) {
  const cart = getCart();
  const item = cart.find((c) => c.lineId === lineId);
  if (item) item.qty = Math.max(1, qty);
  saveCart(cart);
}

function formatRp(num) {
  return "Rp" + Math.round(num).toLocaleString("id-ID");
}

function uid() {
  return "L" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- Cart badge in nav (every page) ---------- */
function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cartCount();
  });
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("is-open"));
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/* ---------- WhatsApp link builder ---------- */
function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsappFloat(defaultMessage) {
  const el = document.querySelector("[data-wa-float]");
  if (!el) return;
  el.href = waLink(defaultMessage || "Halo Aether Line, saya ingin bertanya tentang produk streetwear custom.");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initNavToggle();
  initWhatsappFloat();
});
