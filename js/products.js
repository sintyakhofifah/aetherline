/* =========================================================
   AETHER LINE — products.js
   Data produk dummy. Ganti field "image" dengan path foto asli
   (JPG/PNG) di folder /assets saat foto produk sudah tersedia —
   cukup timpa file dengan nama yang sama, atau ubah path di sini.

   isCustom: true  -> pelanggan WAJIB pilih lokasi/ukuran sablon
             dan upload desain sendiri sebelum bisa masuk keranjang.
   price (untuk produk isCustom) = harga kaos/hoodie polos saja.
   Biaya sablon ditambahkan sesuai lokasi yang dipilih (lihat
   PRINT_LOCATIONS di bawah).
   ========================================================= */

const PRODUCTS = [
  {
    id: "AL-01",
    name: "Aether Original Tee",
    category: "Custom Design",
    price: 125000,
    image: "assets/costume.png",
    desc: "Kaos streetwear basic dengan print mountain-star di dada, cotton combed 24s.",
    isCustom: true,
  },
  {
    id: "AL-02",
    name: "Aether Constellation Tee",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk1.png",
    desc: "Varian sand dengan motif konstelasi — \"Live Different, Be Yourself\".",
    isCustom: false,
  },
  {
    id: "AL-03",
    name: "Aether \"Create\" Graphic Tee",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk2.png",
    desc: "Graphic tee hitam dengan tipografi \"Create — Your Own Universe\".",
    isCustom: false,
  },
  {
    id: "AL-04",
    name: "Aether Mountain Wordmark Tee",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk3.png",
    desc: "Siluet gunung dengan wordmark \"Be Yourself\" di dada.",
    isCustom: false,
  },
  {
    id: "AL-05",
    name: "Aether Custom Design Tee",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk4.png",
    desc: "Kaos polos cotton combed — upload desainmu, kami cetak sesuai permintaan.",
    isCustom: false,
  },
  {
    id: "AL-06",
    name: "Aether Custom Design Hoodie",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk5.png",
    desc: "Hoodie polos fleece premium — upload desainmu dan kami cetak di sablon.",
    isCustom: false,
  },
  {
    id: "AL-07",
    name: "Aether Custom Design Long Sleeve",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk6.png",
    desc: "Kaos lengan panjang polos cotton combed — upload desainmu dan kami cetak.",
    isCustom: false,
  },
  {
    id: "AL-08",
    name: "Aether Custom Design Crop Tee",
    category: "Ready Stock",
    price: 125000,
    image: "assets/produk7.png",
    desc: "Kaos crop polos cotton combed — upload desainmu dan kami cetak sesuai permintaan.",
    isCustom: false,
  }
];

const SIZES = ["S", "M", "L", "XL"];

const PAYMENT_METHODS = [
  { id: "qris", label: "QRIS", note: "Scan & bayar lewat e-wallet / m-banking apa saja" },
  { id: "bca", label: "BCA", note: "Transfer Virtual Account BCA" },
  { id: "bri", label: "BRI", note: "Transfer Virtual Account BRI" },
  { id: "mandiri", label: "Mandiri", note: "Transfer Virtual Account Mandiri" },
  { id: "bsi", label: "BSI", note: "Transfer Virtual Account BSI" },
  { id: "bni", label: "BNI", note: "Transfer Virtual Account BNI" },
];

