/* =========================================================
   AETHER LINE — katalog.js
   ========================================================= */

let activeFilter = "Semua";
let modalState = { product: null, size: "M", qty: 1, designDataUrl: null };

function renderGrid() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  const list = PRODUCTS.filter((p) => activeFilter === "Semua" || p.category === activeFilter);

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card__img" data-open-modal="${p.id}">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-card__body">
        <span class="tag ${p.isCustom ? "tag--custom" : ""}">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="product-card__row">
          <div class="price-block">
            <strong>${formatRp(p.price)}</strong>
          </div>
          <button class="btn btn--sm ${p.isCustom ? "btn--primary" : "btn--ghost"}" data-open-modal="${p.id}">
            ${p.isCustom ? "Upload Desain" : "+ Keranjang"}
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function initFilterTabs() {
  document.getElementById("filter-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-tabs__btn");
    if (!btn) return;
    document.querySelectorAll(".filter-tabs__btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    renderGrid();
  });
}

/* ---------- Modal ---------- */
const modalEl = document.getElementById("product-modal");

function updateModalPrice() {
  const { product } = modalState;
  const breakdown = document.getElementById("modal-price-breakdown");
  document.getElementById("modal-product-price").textContent = formatRp(product.price);
  breakdown.textContent = "";
}

function openModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  modalState = {
    product,
    size: "M",
    qty: 1,
    designDataUrl: null,
  };

  document.getElementById("modal-product-img").src = product.image;
  document.getElementById("modal-product-img").alt = product.name;
  document.getElementById("modal-product-tag").textContent = product.category;
  document.getElementById("modal-product-tag").className = "tag" + (product.isCustom ? " tag--custom" : "");
  document.getElementById("modal-product-name").textContent = product.name;
  document.getElementById("modal-product-desc").textContent = product.desc;
  document.getElementById("modal-qty-val").textContent = "1";
  document.getElementById("modal-hint").textContent = "";
  updateModalPrice();

  // size picker
  const sizeWrap = document.getElementById("modal-size-picker");
  sizeWrap.innerHTML = "";
  SIZES.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = s;
    if (s === modalState.size) b.classList.add("is-active");
    b.addEventListener("click", () => {
      modalState.size = s;
      sizeWrap.querySelectorAll("button").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
    });
    sizeWrap.appendChild(b);
  });

  // print location picker — REMOVED
  const locationBlock = document.getElementById("modal-location-block");
  locationBlock.hidden = true;

  // custom upload block
  const uploadBlock = document.getElementById("modal-custom-upload");
  const preview = document.getElementById("modal-upload-preview");
  const fileInput = document.getElementById("modal-file-input");
  fileInput.value = "";
  preview.innerHTML = "<span>Belum ada file diunggah. Format JPG/PNG, maks 5MB.</span>";
  uploadBlock.hidden = !product.isCustom;

  modalEl.classList.add("is-open");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalEl.classList.remove("is-open");
  modalEl.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-open-modal]");
  if (trigger) openModal(trigger.dataset.openModal);
});

document.getElementById("modal-qty").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-step]");
  if (!btn) return;
  modalState.qty = Math.max(1, modalState.qty + Number(btn.dataset.step));
  document.getElementById("modal-qty-val").textContent = modalState.qty;
});

document.getElementById("modal-file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const preview = document.getElementById("modal-upload-preview");
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    preview.innerHTML = "<span style='color:var(--error);'>File terlalu besar (maks 5MB).</span>";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    modalState.designDataUrl = reader.result;
    preview.innerHTML = `<img src="${reader.result}" alt="Preview desain"><span>${file.name}</span>`;
  };
  reader.readAsDataURL(file);
});

document.getElementById("modal-add-btn").addEventListener("click", () => {
  const { product, size, qty, designDataUrl } = modalState;
  if (product.isCustom && !designDataUrl) {
    document.getElementById("modal-hint").textContent = "Upload desainmu dulu sebelum menambahkan ke keranjang.";
    return;
  }
  const unitPrice = product.price;
  addToCart({
    lineId: uid(),
    id: product.id,
    name: product.name,
    price: unitPrice,
    size,
    qty,
    image: designDataUrl || product.image,
    customDesign: !!designDataUrl,
    printLocation: null,
  });
  closeModal();
  showToast(`${product.name} (${size}) ditambahkan ke keranjang.`);
});

renderGrid();
initFilterTabs();
