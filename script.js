// 1. GLOBAL STATE & INITIALIZATION
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
let currentProduct = "";

// Simpan data ke local storage
function saveCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
}

// Jalankan update UI saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', updateCartUI);

// 2. FUNGSI KERANJANG (LOGIKA & UI)
function addToCart(name, price) {
    const itemIndex = cart.findIndex(item => item.name === name);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    alert(name + " ditambahkan ke keranjang!");
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) {
        removeItem(index);
    } else {
        saveCart();
        updateCartUI();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');

    // 1. Update Notifikasi Angka
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
        // Beri warna ungu neon jika ada isi
        cartCount.style.background = totalItems > 0 ? "var(--neon-purple)" : ""; 
    }

    // 2. Update Daftar Produk di Modal
    if (cartList) {
        cartList.innerHTML = '';
        let totalHarga = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<p style="color: var(--text-dim); text-align:center; padding: 30px 0; font-style: italic;">Keranjang kosong...</p>';
        } else {
            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                totalHarga += subtotal;
                
                cartList.innerHTML += `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-bottom: 18px; padding: 15px; border: 1px solid rgba(0, 242, 255, 0.1); border-radius: 8px; background: rgba(0, 242, 255, 0.02); text-align: center;">
                        
                        <div style="margin-bottom: 4px;">
                            <p style="color: var(--neon-blue); font-weight: bold; margin:0; font-size: 15px; letter-spacing: 0.5px;">${item.name}</p>
                            <small style="color: var(--text-dim); font-size: 12px;">Rp ${item.price.toLocaleString('id-ID')}</small>
                        </div>
                        
                        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 5px; background: rgba(0,0,0,0.2); padding: 5px 15px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                            <button onclick="changeQuantity(${index}, -1)" 
                                style="width:28px; height:28px; border: 1px solid #ff4d4d; color: #ff4d4d; background:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size: 16px; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">
                                -
                            </button>
                            
                            <span style="font-weight: bold; color: white; min-width: 30px; text-align: center; font-size: 16px; font-family: 'Courier New', monospace;">
                                ${item.quantity}
                            </span>
                            
                            <button onclick="changeQuantity(${index}, 1)" 
                                style="width:28px; height:28px; border: 1px solid #00ff88; color: #00ff88; background:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size: 16px; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">
                                +
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        if (cartTotal) cartTotal.innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
    }
}
// 3. FUNGSI NAVIGASI & MODAL
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (nav) nav.classList.toggle('active');
    if (toggle) toggle.classList.toggle('active');
}

// Menutup menu jika klik di luar
document.addEventListener('click', function(event) {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (nav && !nav.contains(event.target) && toggle && !toggle.contains(event.target)) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
    }
});

// 4. CHECKOUT WHATSAPP
function processCheckout() {
    if (cart.length === 0) return alert("Keranjang belanja Anda masih kosong!");

    let pesan = "Halo TechStore, saya ingin memesan produk berikut:\n\n";
    let totalProduk = 0;
    const biayaOngkir = 100000;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalProduk += subtotal;
        pesan += `${index + 1}. *${item.name}*\n   Jumlah: ${item.quantity}x\n   Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n\n`;
    });

    const totalKeseluruhan = totalProduk + biayaOngkir;
    pesan += `--------------------------------\n`;
    pesan += `Total Produk: Rp ${totalProduk.toLocaleString('id-ID')}\n`;
    pesan += `Biaya Ongkir: Rp ${biayaOngkir.toLocaleString('id-ID')}\n`;
    pesan += `*Total Akhir: Rp ${totalKeseluruhan.toLocaleString('id-ID')}*`;

    window.open("https://wa.me/6285293395795?text=" + encodeURIComponent(pesan), '_blank');
}

// 5. FITUR SEARCH
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return; // Keluar jika input pencarian tidak ada di halaman tersebut

    const filter = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    let found = false;

    productCards.forEach(card => {
        // Mengambil teks dari tag h3 (nama produk)
        const productName = card.querySelector('h3').innerText.toLowerCase();
        
        if (productName.includes(filter)) {
            card.style.display = ""; // Tampilkan
            found = true;
        } else {
            card.style.display = "none"; // Sembunyikan
        }
    });

    // Opsional: Tampilkan pesan jika tidak ada produk yang cocok
    const noResultsMsg = document.getElementById('no-results');
    if (productCards.length > 0) {
        if (!found) {
            if (!noResultsMsg) {
                const msg = document.createElement('p');
                msg.id = 'no-results';
                msg.innerText = "Produk tidak ditemukan...";
                msg.style.textAlign = 'center';
                msg.style.color = 'var(--text-dim)';
                document.querySelector('.product-grid').appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// 6. LOGIKA VARIAN PRODUK
const productData = {
   "iPhone 16 Pro Max": {
    prices: {
        "256gb-white": 20499000,
        "256gb-black": 20599000,
        "256gb-natural": 20499000,
        "256gb-desert titanium": 20799000,
        "512gb-white": 23499000,
        "512gb-black": 23599000, 
        "512gb-natural": 23799000, 
        "512gb-desert titanium": 23699000,  
        "1tb-white": 26499000
    },
    rams: ["256gb", "512gb", "1tb"],
    colors: ["black", "natural", "white", "desert titanium"]
},
"iPhone 16 Pro ": {
    prices: {
        "128gb-white": 17799000,
        "128gb-black": 17699000,
        "128gb-natural": 17500000,
        "128gb-desert titanium": 17799000,
        "256gb-white": 19599000,
        "256gb-black": 19499000,
        "256gb-natural": 19699000,
        "256gb-desert titanium": 19899000,
        
    },
    rams: ["128gb","256gb",],
    colors: ["black", "natural", "white", "desert titanium"]
    },
   "iPhone 16 Plus": {
    prices: {
        "128gb-white": 16999000,
        "128gb-black": 17100000,
        "128gb-pink": 17070000,
        "128gb-teal": 17150000,
        "128gb-ultramarine": 17150000
    },
    rams: ["128gb"],
    colors: ["black", "pink", "white", "teal", "ultramarine"]

},
   "iPhone 16 ": {
    prices: {
        "128gb-white": 14999000,
        "128gb-black": 15100000,
        "128gb-pink": 15170000,
        "128gb-teal": 15150000,
        "128gb-ultramarine": 151600000
    },
    rams: ["128gb"],
    colors: ["black", "pink", "white", "teal", "ultramarine"]
   },
    "iPhone 15 Pro Max": {
    prices: {
        "256gb-natural": 16500000,
        "256gb-blue": 16550000,
        "256gb-white": 16500000,
        "256gb-black titanium": 16600000
    },
    rams: ["256gb"],
    colors: ["natural", "blue", "white", "black titanium"]
},
// Masukkan ke dalam const productData = { ... }
"iPhone 15 Pro ": {
    prices: {
        "128gb-natural": 14250000,
        "128gb-blue": 14250000,
        "128gb-white": 14250000,
        "128gb-black": 14250000
    },
    rams: ["128gb"],
    colors: ["natural", "blue", "white", "black"]
},
"iPhone 15 Plus": {
    prices: {
        "128gb-black": 13500000,
        "128gb-blue": 13500000,
        "128gb-green": 13500000,
        "128gb-yellow": 13500000,
        "128gb-pink": 13500000
    },
    rams: ["128gb"],
    colors: ["black", "blue", "green", "yellow", "pink"]
},
"iPhone 15": {
    prices: {
        "128gb-black": 12550000,
        "128gb-blue": 12550000,
        "128gb-pink": 12550000
    },
    rams: ["128gb"],
    colors: ["black", "blue", "pink"]
},
"iPhone 14 Pro Max": {
    prices: {
        "128gb-deep purple": 13500000,
        "128gb-gold": 13500000,
        "128gb-silver": 13500000,
        "128gb-space black": 13500000
    },
    rams: ["128gb"],
    colors: ["deep purple", "gold", "silver", "space black"]
},
"iPhone 14 Pro ": {
    prices: {
        "128gb-deep purple": 11450000,
        "128gb-gold": 11450000,
        "128gb-silver": 11450000,
        "128gb-space black": 11450000
    },
    rams: ["128gb"],
    colors: ["deep purple", "gold", "silver", "space black"]
},
"iPhone 14 Plus": {
    prices: {
        "128gb-midnight": 9750000,
        "128gb-starlight": 9750000,
        "128gb-blue": 9750000,
        "128gb-purple": 9750000,
        "128gb-red": 9750000
    },
    rams: ["128gb"],
    colors: ["midnight", "starlight", "blue", "purple", "red"]
},
"iPhone 14": {
    prices: {
        "128gb-midnight": 8750000,
        "128gb-starlight": 8750000,
        "128gb-blue": 8750000
    },
    rams: ["128gb"],
    colors: ["midnight", "starlight", "blue"]
},
"iPhone 13": {
    prices: {
        "128gb-midnight": 8500000,
        "128gb-starlight": 8500000,
        "128gb-blue": 8500000,
        "128gb-pink": 8500000
    },
    rams: ["128gb"],
    colors: ["midnight", "starlight", "blue", "pink"]
},
"iPhone 12": {
    prices: {
        "64gb-black": 6500000,
        "64gb-white": 6500000,
        "64gb-blue": 6500000
    },
    rams: ["64gb"],
    colors: ["black", "white", "blue"]
},
"iPhone 11": {
    prices: {
        "64gb-black": 4500000,
        "64gb-white": 4500000,
        "64gb-purple": 4500000
    },
    rams: ["64gb"],
    colors: ["black", "white", "purple"]
},

"MacBook Air M3": {
    prices: {
        "8gb-midnight": 18500000,
        "8gb-starlight": 18500000,
        "16gb-midnight": 22000000,
        "16gb-starlight": 22000000
    },
    rams: ["8gb", "16gb"],
    colors: ["midnight", "starlight"]
},
"MacBook Air M2": {
    prices: {
        "8gb-space gray": 16500000,
        "8gb-silver": 16500000,
        "16gb-space gray": 19500000
    },
    rams: ["8gb", "16gb"],
    colors: ["space gray", "silver"]
},
"Lenovo LOQ 15": {
    prices: {
        "8gb-luna grey": 14500000,
        "16gb-luna grey": 16000000
    },
    rams: ["8gb", "16gb"],
    colors: ["luna grey"]
},
"Acer Swift Go Fsg14": {
    prices: {
        "16gb-silver": 12500000,
        "16gb-pink": 12500000
    },
    rams: ["16gb"],
    colors: ["silver", "pink"]
},
"MSI Modern  AI C11M": {
    prices: {
        "8gb-black": 10500000,
        "16gb-black": 12000000
    },
    rams: ["8gb", "16gb"],
    colors: ["black"]
},
"Dell SPX 13": {
    prices: {
        "16gb-platinum": 15500000,
        "32gb-platinum": 18000000
    },
    rams: ["16gb", "32gb"],
    colors: ["platinum"]
},
"Lenovo ThinkCenter": {
    prices: {
        "8gb-black": 17000000,
        "16gb-black": 18500000
    },
    rams: ["8gb", "16gb"],
    colors: ["black"]
},
"pc editing ram 16": {
    prices: {
        "16gb-black": 8000000,
        "16gb-white": 8200000
    },
    rams: ["16gb"],
    colors: ["black", "white"]
},
"paket pc gaming lengkap core i7": {
    prices: {
        "16gb-rgb black": 10000000,
        "32gb-rgb black": 11500000
    },
    rams: ["16gb", "32gb"],
    colors: ["rgb black"]
}
};

function openVariantModal(name) {
    currentProduct = name;
    const data = productData[name];
    if (!data) return alert("Varian belum tersedia untuk produk ini.");

    document.getElementById('modal-product-name').innerText = name;
    document.getElementById('modal-ram-select').innerHTML = data.rams.map(r => `<option value="${r}">${r.toUpperCase()}</option>`).join('');
    document.getElementById('modal-color-select').innerHTML = data.colors.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('');

    updateModalPrice();
    document.getElementById('variant-modal').style.display = 'block';
}

function updateModalPrice() {
    const ram = document.getElementById('modal-ram-select').value;
    const color = document.getElementById('modal-color-select').value;
    const price = productData[currentProduct].prices[`${ram}-${color}`];
    document.getElementById('modal-price-display').innerText = "Rp " + (price ? price.toLocaleString('id-ID') : "---");
}

function confirmAddToCart() {
    const ram = document.getElementById('modal-ram-select').value;
    const color = document.getElementById('modal-color-select').value;
    const price = productData[currentProduct].prices[`${ram}-${color}`];
    if (!price) return alert("Varian ini tidak tersedia.");
    
    const fullName = `${currentProduct} (${ram.toUpperCase()} - ${color})`;
    addToCart(fullName, price); 
    closeVariantModal();
}

function closeVariantModal() {
    document.getElementById('variant-modal').style.display = 'none';
}
// --- FUNGSI FORM KONTAK WA ---
// Gunakan DOMContentLoaded untuk memastikan elemen form sudah ada
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('whatsapp-form');
    
    // Cek apakah kita sedang di halaman yang ada form kontaknya
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Ambil data dari input
            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const pesan = document.getElementById('pesan').value;
            const nomorWA = "6285293395795"; 

            // Susun format pesan (menggunakan encodeURIComponent agar simbol aman)
            const teks = `Halo TechStore,%0A%0A` +
                         `*Nama:* ${nama}%0A` +
                         `*Email:* ${email}%0A` +
                         `*Pesan:* ${pesan}`;

            // Buka WhatsApp di tab baru
            window.open(`https://wa.me/${nomorWA}?text=${teks}`, '_blank');
        });
    }
});
function handleSearch(event) {
    // Jika user menekan tombol Enter
    if (event.key === "Enter") {
        const query = document.getElementById('search-input').value;
        // Pindah ke halaman katalog sambil membawa kata kunci
        window.location.href = `katalog.html?search=${encodeURIComponent(query)}`;
    }
}

// Tambahkan kode ini di dalam DOMContentLoaded agar otomatis mencari saat buka halaman katalog
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery && document.getElementById('search-input')) {
        document.getElementById('search-input').value = searchQuery;
        searchProducts(); // Jalankan fungsi filter
    }
});
// --- FITUR PENCARIAN GLOBAL ---

// 1. Fungsi untuk filter produk yang ada di halaman saat ini
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const filter = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').innerText.toLowerCase();
        if (productName.includes(filter)) {
            card.style.display = ""; // Tampilkan jika cocok
        } else {
            card.style.display = "none"; // Sembunyikan jika tidak cocok
        }
    });
}

// 2. Fungsi agar jika tekan Enter di Beranda, langsung lari ke Katalog
function handleSearch(event) {
    if (event.key === "Enter") {
        const query = document.getElementById('search-input').value;
        
        // Jika sedang TIDAK di halaman katalog, pindah ke katalog membawa kata kunci
        if (!window.location.pathname.includes('katalog.html')) {
            window.location.href = `katalog.html?search=${encodeURIComponent(query)}`;
        } else {
            // Jika sudah di katalog, jalankan pencarian biasa
            searchProducts();
        }
    }
}

// 3. Logika otomatis saat halaman Katalog dibuka (untuk menangkap hasil cari dari Beranda)
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQ = urlParams.get('search');
    
    if (searchQ && document.getElementById('search-input')) {
        document.getElementById('search-input').value = searchQ;
        // Beri jeda 300ms agar browser selesai memuat kartu produk sebelum difilter
        setTimeout(searchProducts, 300);
    }
});