/* =========================================================
   AETHER LINE — keranjang.js
   ========================================================= */

function renderCart() {
  const container = document.getElementById("cart-items");
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <h3>Keranjangmu masih kosong</h3>
        <p>Pilih produk dari katalog, atau upload desainmu sendiri untuk dicetak.</p>
        <a href="katalog.html" class="btn btn--primary">Lihat Katalog</a>
      </div>`;
  } else {
    container.innerHTML = "";
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item__img"><img src="${item.image}" alt="${item.name}"></div>
        <div class="cart-item__meta">
          <h3>${item.name}</h3>
          <div class="specs">
            <span>Ukuran: ${item.size}</span>
            ${item.printLocation ? `<span>Sablon: ${item.printLocation.label} (${item.printLocation.size})</span>` : ""}
            ${item.customDesign ? '<span class="tag tag--custom">Desain Sendiri</span>' : ""}
          </div>
          <strong>${formatRp(item.price)}</strong>
        </div>
        <div class="cart-item__actions">
          <div class="qty-stepper" data-line="${item.lineId}">
            <button type="button" data-step="-1" aria-label="Kurangi">−</button>
            <span>${item.qty}</span>
            <button type="button" data-step="1" aria-label="Tambah">+</button>
          </div>
          <button class="cart-item__remove" data-remove="${item.lineId}">Hapus</button>
        </div>`;
      container.appendChild(row);
    });
  }

  document.getElementById("sum-subtotal").textContent = formatRp(cartTotal(cart));
  document.getElementById("sum-total").textContent = formatRp(cartTotal(cart));

  const checkoutBtn = document.getElementById("checkout-btn");
  if (cart.length === 0) {
    checkoutBtn.classList.add("btn--disabled-link");
    checkoutBtn.setAttribute("aria-disabled", "true");
    checkoutBtn.addEventListener("click", (e) => e.preventDefault());
  }
}

document.getElementById("cart-items").addEventListener("click", (e) => {
  const stepBtn = e.target.closest("button[data-step]");
  const removeBtn = e.target.closest("[data-remove]");

  if (stepBtn) {
    const lineId = stepBtn.closest("[data-line]").dataset.line;
    const cart = getCart();
    const item = cart.find((c) => c.lineId === lineId);
    if (!item) return;
    const next = item.qty + Number(stepBtn.dataset.step);
    if (next < 1) return;
    setQty(lineId, next);
    renderCart();
  }

  if (removeBtn) {
    removeFromCart(removeBtn.dataset.remove);
    renderCart();
    showToast("Produk dihapus dari keranjang.");
  }
});

renderCart();
