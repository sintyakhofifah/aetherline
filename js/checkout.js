/* =========================================================
   AETHER LINE — checkout.js
   ========================================================= */

let selectedPayment = null;
let currentOrder = null;

function renderOrderReview() {
  const cart = getCart();
  const wrap = document.getElementById("order-review");

  if (cart.length === 0) {
    wrap.innerHTML = `<p style="font-size:0.9rem;color:#6b6356;">Keranjangmu kosong. <a href="katalog.html" style="color:var(--terracotta);text-decoration:underline;">Pilih produk dulu</a> sebelum checkout.</p>`;
  } else {
    wrap.innerHTML = cart
      .map(
        (item) => `
        <div class="review-item">
          <div>
            <div class="name">${item.name} <span class="specs">× ${item.qty}</span></div>
            <div class="specs">Ukuran ${item.size}${item.printLocation ? ` · Sablon ${item.printLocation.label}` : ""}${item.customDesign ? " · Desain Sendiri" : ""}</div>
          </div>
          <strong>${formatRp(item.price * item.qty)}</strong>
        </div>`
      )
      .join("");
  }

  const total = cartTotal(cart);
  document.getElementById("ck-subtotal").textContent = formatRp(total);
  document.getElementById("ck-grandtotal").textContent = formatRp(total);

  const payBtn = document.getElementById("pay-now-btn");
  payBtn.disabled = cart.length === 0;
}

function renderPaymentGrid() {
  const grid = document.getElementById("pay-grid");
  grid.innerHTML = PAYMENT_METHODS
    .map(
      (m) => `
      <label class="pay-card" data-method="${m.id}">
        <input type="radio" name="payment" value="${m.id}" required>
        <span>${m.label}</span>
      </label>`
    )
    .join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".pay-card");
    if (!card) return;
    grid.querySelectorAll(".pay-card").forEach((c) => c.classList.remove("is-active"));
    card.classList.add("is-active");
    selectedPayment = PAYMENT_METHODS.find((m) => m.id === card.dataset.method);
    document.getElementById("pay-note").textContent = selectedPayment ? selectedPayment.note : "";
  });
}

function buildOrderId() {
  const now = new Date();
  return "AL" + now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") + "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}

function renderReceipt(order) {
  currentOrder = order;
  document.getElementById("r-order-id").textContent = "#" + order.id;
  document.getElementById("r-date").textContent = order.dateLabel;
  document.getElementById("r-nama").textContent = order.nama;
  document.getElementById("r-hp").textContent = order.hp;
  document.getElementById("r-alamat").textContent =
    `${order.alamat}, ${order.kota}, ${order.provinsi} ${order.kodepos}`;
  document.getElementById("r-email").textContent = order.email;
  document.getElementById("r-payment").textContent = order.payment.label;
  document.getElementById("r-total").textContent = formatRp(order.total);

  document.getElementById("r-items").innerHTML = order.items
    .map(
      (item) => `
      <div class="ticket__row">
        <span>${item.name} (${item.size}) × ${item.qty}${item.printLocation ? ` · Sablon ${item.printLocation.label}` : ""}${item.customDesign ? " · Desain Sendiri" : ""}</span>
        <strong>${formatRp(item.price * item.qty)}</strong>
      </div>`
    )
    .join("");

  const waMsg = `Halo Aether Line, saya ingin konfirmasi pesanan ${order.id} atas nama ${order.nama}. Total pembayaran ${formatRp(order.total)} via ${order.payment.label}.`;
  document.getElementById("r-wa-confirm").href = waLink(waMsg);

  document.getElementById("checkout-flow").hidden = true;
  document.getElementById("receipt").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById("ck-error");
  const cart = getCart();

  if (cart.length === 0) {
    errorEl.textContent = "Keranjangmu kosong. Tambahkan produk dulu sebelum membayar.";
    return;
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  if (!selectedPayment) {
    errorEl.textContent = "Pilih metode pembayaran terlebih dahulu.";
    return;
  }
  errorEl.textContent = "";

  const now = new Date();
  const order = {
    id: buildOrderId(),
    dateLabel: now.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }),
    email: form.email.value.trim(),
    nama: form.nama.value.trim(),
    hp: form.hp.value.trim(),
    alamat: form.alamat.value.trim(),
    kota: form.kota.value.trim(),
    provinsi: form.provinsi.value.trim(),
    kodepos: form.kodepos.value.trim(),
    items: cart,
    payment: selectedPayment,
    total: cartTotal(cart),
    storeAddress: STORE_ADDRESS,
  };

  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  renderReceipt(order);
  saveCart([]); // pesanan selesai, kosongkan keranjang
});

renderOrderReview();
renderPaymentGrid();

/* ---------- Download struk sebagai PNG ---------- */
async function downloadReceipt() {
  const ticket = document.querySelector(".ticket");
  const btn = document.getElementById("r-download");
  if (!ticket || !currentOrder) return;

  if (typeof html2canvas !== "function") {
    // fallback jika library gagal dimuat (mis. tidak ada koneksi internet)
    showToast("Mengunduh gagal dimuat, membuka dialog cetak sebagai gantinya.");
    window.print();
    return;
  }

  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Menyiapkan...";

  try {
    const canvas = await html2canvas(ticket, {
      scale: 2,
      backgroundColor: "#F3ECDC",
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `struk-aetherline-${currentOrder.id}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Struk berhasil diunduh.");
  } catch (err) {
    showToast("Gagal mengunduh struk. Coba lagi.");
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
}

document.getElementById("r-download").addEventListener("click", downloadReceipt);
