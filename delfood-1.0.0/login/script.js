// Scroll promo
function scrollPromo(direction) {
  const container = document.getElementById('promoCarousel');
  const scrollAmount = 220;
  container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function logout() {
  sessionStorage.clear();
  window.location.href = "delfood-1.0.0/about.html";
}

function selectTab(element) {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => tab.classList.remove("active"));
  element.classList.add("active");

  const kategori = element.innerText.toLowerCase().replace(" ", "");
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    const dataKategori = card.getAttribute("data-kategori").toLowerCase();
    card.style.display = (kategori === "rekomendasi" || dataKategori.includes(kategori)) ? "block" : "none";
  });
}

const productPrices = {
  "Nasi Goreng Spesial": 20000,
  "Ayam Bakar Madu": 25000,
  "Es Teh Manis": 5000,
  "Burger Keju": 22000,
  "Sate Ayam": 18000,
  "Mie Ayam Komplit": 17000,
  "Dimsum Ayam": 12000,
  "Kopi Susu Gula Aren": 15000,
  "Kwetiau Goreng": 22000,
  "Bakso Ayam": 18000,
  "Ayam Penyet": 25000,
  "Es Jeruk": 7000,
  "Es Kopi Hitam": 10000,
  "Sate Kambing": 30000,
  "Spaghetti Bolognese": 28000,
  "Smoothie Mangga": 18000,
  "Kwetiau Siram": 24000,
  "Pisang Goreng": 10000,
  "Jus Alpukat": 15000,
  "Teh Tarik": 12000
};

const productData = {
  "Nasi Goreng Spesial": {
    price: 20000,
    image: "https://www.wandercooks.com/wp-content/uploads/2023/05/nasi-goreng-3.jpg",
    desc: "Nasi goreng spesial dengan topping lengkap dan rasa mantap!",
    rating: "4.7 (120 Ulasan)"
  },
  "Ayam Bakar Madu": {
    price: 25000,
    image: "https://img.okezone.com/okz/500/library/images/2021/02/04/faiznkk98mggpvrjn4dw_17662.jpg",
    desc: "Ayam bakar madu empuk dengan bumbu rempah pilihan.",
    rating: "4.8 (85 Ulasan)"
  },
  "Burger Keju": {
    price: 22000,
    image: "https://png.pngtree.com/background/20230614/original/pngtree-cheeseburger-with-cheese-picture-image_3520739.jpg",
    desc: "Burger keju dengan daging sapi premium dan lelehan keju.",
    rating: "4.5 (60 Ulasan)"
  }
};

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function () {
      const name = this.querySelector("h4").innerText;
      const detail = productData[name];
      const image = this.querySelector("img").src;

      document.getElementById("detailName").innerText = name;
      document.getElementById("detailImage").src = detail?.image || image;
      document.getElementById("detailPrice").innerText = formatRupiah(detail?.price || productPrices[name] || 0);
      document.getElementById("detailDesc").innerText = detail?.desc || "Deskripsi belum tersedia.";
      document.getElementById("detailRating").innerText = "\u2B50 " + (detail?.rating || "4.5 (50 Ulasan)");
      document.getElementById("detailQty").value = 1;

      document.getElementById("productDetailModal").style.display = "flex";
    });
  });
});

function closeProductDetail() {
  document.getElementById("productDetailModal").style.display = "none";
}

function proceedToOrder() {
  const name = document.getElementById("detailName").innerText;
  document.getElementById("productName").innerText = name;

  document.getElementById("orderModal").style.display = "flex";
  document.getElementById("productDetailModal").style.display = "none";

  document.getElementById("productDetailSection").style.display = "block";
  document.getElementById("orderFormSection").style.display = "none";

  // Set data awal
  document.getElementById("productImage").src = document.getElementById("detailImage").src;
  document.getElementById("productDescription").innerText = document.getElementById("detailPrice").innerText + " · " + document.getElementById("detailRating").innerText;
}

function showOrderForm() {
  // Sembunyikan detail
  document.getElementById("productDetailSection").style.display = "none";

  // Tampilkan form
  document.getElementById("orderFormSection").style.display = "block";

  // Ambil data dari modal detail produk
  const name = document.getElementById("detailName").innerText;
  document.getElementById("productName").innerText = name;

  const price = productPrices[name] || 0;
  document.getElementById("totalBayar").innerText = formatRupiah(price);

  // Set default
  document.getElementById("quantity").value = 1;
  document.getElementById("useVoucher").checked = false;
  document.getElementById("paymentMethod").value = "cod";
  document.getElementById("rekeningInfo").style.display = "none";
}


function updateTotal() {
  const name = document.getElementById("productTitle").innerText;
  const qty = parseInt(document.getElementById("quantity").value) || 1;
  const voucher = document.getElementById("useVoucher").checked;
  let total = (productPrices[name] || 0) * qty;
  if (voucher) total *= 0.9;
  document.getElementById("totalBayar").innerText = formatRupiah(total);
}

function formatRupiah(angka) {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function handlePaymentChange() {
  const method = document.getElementById("paymentMethod").value;
  const rekeningInfo = document.getElementById("rekeningInfo");
  const label = document.getElementById("rekeningLabel");
  const value = document.getElementById("rekeningValue");

  if (method === "dana") {
    rekeningInfo.style.display = "block";
    label.innerText = "Nomor DANA:";
    value.readOnly = false;
    value.placeholder = "08xxxxxxxxxx";
  } else if (method === "bca") {
    rekeningInfo.style.display = "block";
    label.innerText = "Nomor Rekening BCA:";
    value.readOnly = false;
    value.placeholder = "1234567890";
  } else {
    rekeningInfo.style.display = "none";
    value.value = "";
  }

  calculateTotal();
}

function calculateTotal() {
  const name = document.getElementById("productName").innerText || document.getElementById("detailName").innerText;
  const price = productPrices[name] || 0;
  const qty = parseInt(document.getElementById("quantity").value) || 1;
  const useVoucher = document.getElementById("useVoucher").checked;

  let total = price * qty;
  if (useVoucher) total *= 0.9;

  document.getElementById("totalBayar").innerText = formatRupiah(total);
}


function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

function submitOrder() {
  const name = document.getElementById("productName").innerText;
  const qty = document.getElementById("quantity").value;
  const payment = document.getElementById("paymentMethod").value;
  const voucher = document.getElementById("useVoucher").checked;
  const total = document.getElementById("totalBayar").innerText;

  // Tampilkan overlay sukses
  document.getElementById("successOverlay").style.display = "flex";

  // Setelah 2.5 detik, tutup semua
  setTimeout(() => {
    document.getElementById("successOverlay").style.display = "none";
    document.getElementById("orderModal").style.display = "none";

    // Reset form
    document.getElementById("orderFormSection").style.display = "none";
    document.getElementById("productDetailSection").style.display = "block";
    document.getElementById("quantity").value = 1;
    document.getElementById("useVoucher").checked = false;
    document.getElementById("totalBayar").innerText = "Rp 0";
  }, 2500);
}

// filtering untuk produk
function filterProducts(category) {
  const cards = document.querySelectorAll('.card');
  const links = document.querySelectorAll('.sidebar-kategori a');

  // Tampilkan produk sesuai kategori
  cards.forEach(card => {
    const kategori = card.getAttribute('data-category');
    if (category === 'all' || kategori === category) {
      card.classList.add('show');
    } else {
      card.classList.remove('show');
    }
  });

  // Update highlight link sidebar
  links.forEach(link => {
    link.classList.remove('active');
    const onclickAttr = link.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`'${category}'`)) {
      link.classList.add('active');
    }
  });
}



  // Auto-generate produk (10 per kategori)
  const produkContainer = document.getElementById("productsContainer");
  const kategoriList = [
    { id: "ringan", label: "Makanan Ringan", items: ["Keripik Kentang", "Kacang Bawang", "Stick Talas", "Kerupuk Udang", "Tortilla Chips", "Chiki Balls", "Coklat Bar", "Permen Jeruk", "Popcorn Manis", "Roti Mini"] },
    { id: "bahan", label: "Bahan Pokok", items: ["Beras Premium", "Gula Pasir", "Garam Dapur", "Minyak Goreng", "Tepung Terigu", "Telur Ayam", "Santan Instan", "Bawang Merah", "Bawang Putih", "Kecap Manis"] },
    { id: "sarapan", label: "Menu Sarapan", items: ["Roti Lapis", "Telur Rebus", "Bubur Ayam", "Sereal Susu", "Mie Rebus", "Lontong Sayur", "Sosis Bakar", "Pisang Goreng", "Nasi Goreng", "Nasi Uduk"] },
    { id: "minuman", label: "Minuman", items: ["Teh Botol", "Air Mineral", "Jus Jeruk", "Susu Coklat", "Kopi Hitam", "Es Teh Manis", "Soda Gembira", "Sari Apel", "Es Lemon Tea", "Milkshake"] },
    { id: "susu", label: "Susu & Olahan", items: ["Susu Full Cream", "Susu Kental Manis", "Susu UHT", "Yogurt Strawberry", "Yogurt Plain", "Keju Cheddar", "Keju Slice", "Susu Almond", "Keju Parmesan", "Susu Kedelai"] },
    { id: "lainnya", label: "Lainnya", items: ["Bumbu Dapur", "Cuka Masak", "Sambal Botol", "Saos Tomat", "Saos Sambal", "Penyedap Rasa", "Kecap Asin", "Kaldu Ayam", "Rempah Bubuk", "Coklat Masak"] }
  ];

  kategoriList.forEach(kat => {
    kat.items.forEach((nama, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.category = kat.id;
      card.innerHTML = `
        <img src="https://via.placeholder.com/200x150?text=${encodeURIComponent(nama)}" alt="${nama}">
        <div class="card-body">
          <span class="badge">Promo</span>
          <h4>${nama}</h4>
          <p>Rp ${(8 + i * 2)}.000 · 10-20 min</p>
        </div>
      `;
      produkContainer.appendChild(card);
    });
  });

  // search bar
  function searchProducts() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    if (title.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

  