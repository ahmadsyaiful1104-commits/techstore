
let total = 0;

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    alert(name + " ditambahkan ke keranjang!");
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const count = document.getElementById('cart-count');
    const totalDisplay = document.getElementById('cart-total');
    
    count.innerText = cart.length;
    list.innerHTML = "";
    total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<p style="color: var(--text-dim);">Keranjang masih kosong...</p>';
    } else {
        cart.forEach((item) => {
            total += item.price;
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px;">
                    <span>${item.name}</span>
                    <span style="color: var(--neon-blue)">Rp ${item.price.toLocaleString()}</span>
                </div>`;
        });
    }
    totalDisplay.innerText = "Rp " + total.toLocaleString();
}

function processCheckout() {
    if (cart.length === 0) return alert("Keranjang belanja Anda masih kosong!");

    // 1. Header Pesan
    let pesan = "Halo TechStore, saya ingin memesan produk berikut:\n\n";

    let totalProduk = 0;
    const biayaOngkir = 100000; // Biaya Ongkir Tetap

    // 2. Loop List Produk di Keranjang
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalProduk += subtotal;
        
        pesan += `${index + 1}. *${item.name}*\n`;
        pesan += `   Jumlah: ${item.quantity}x\n`;
        pesan += `   Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
        pesan += `   Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n\n`;
    });

    // 3. Tambahkan Rincian Biaya dan Total Akhir
    const totalKeseluruhan = totalProduk + biayaOngkir;

    pesan += `--------------------------------\n`;
    pesan += `Total Harga Produk: Rp ${totalProduk.toLocaleString('id-ID')}\n`;
    pesan += `Biaya Ongkir: Rp ${biayaOngkir.toLocaleString('id-ID')}\n`;
    pesan += `*Total Keseluruhan: Rp ${totalKeseluruhan.toLocaleString('id-ID')}*`;

    // 4. Kirim ke WhatsApp
    const nomorWA = "6285293395795"; // Nomor Anda
    const url = "https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(pesan);
    
    window.open(url, '_blank');

}
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Menutup menu jika user mengklik area di luar menu (opsional tapi bagus)
document.addEventListener('click', function(event) {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
    }
});function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    
    // Menambah/menghapus class 'active' untuk memicu CSS
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Menutup menu jika mengklik di luar area menu
document.addEventListener('click', function(event) {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
    }
});// Mengambil data dari localStorage agar tersinkronisasi antar halaman
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// Fungsi Tambah ke Keranjang
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

// Fungsi Simpan Data
function saveCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
}

// Fungsi Update Tampilan (Notifikasi Angka & List Keranjang)
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');

    // Update Notif Angka Keranjang
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
        
        // Animasi notif jika ada isinya
        if (totalItems > 0) {
            cartCount.style.background = "var(--neon-purple)";
            cartCount.style.boxShadow = "0 0 10px var(--neon-purple)";
        }
    }

    // Update List di dalam Modal
    if (cartList) {
        cartList.innerHTML = '';
        let totalHarga = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<p style="color: var(--text-dim); text-align:center;">Keranjang kosong...</p>';
        } else {
            cart.forEach((item, index) => {
                totalHarga += item.price * item.quantity;
                cartList.innerHTML += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div>
                            <p style="color: var(--neon-blue); font-weight: bold; margin:0;">${item.name}</p>
                            <small>${item.quantity}x - Rp ${item.price.toLocaleString()}</small>
                        </div>
                        <button onclick="removeItem(${index})" style="width:auto; border:none; color:#ff4d4d; background:none; cursor:pointer;">✕</button>
                    </div>
                `;
            });
        }
        if (cartTotal) cartTotal.innerText = `Rp ${totalHarga.toLocaleString()}`;
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    }
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateCartUI);
function searchProducts() {
    // 1. Ambil input dari user dan ubah ke huruf kecil
    const input = document.getElementById('search-input').value.toLowerCase();
    
    // 2. Ambil semua kartu produk
    const productCards = document.querySelectorAll('.product-card');
    
    // 3. Loop melalui setiap kartu produk
    productCards.forEach(card => {
        // Ambil nama produk (biasanya di dalam tag h3)
        const productName = card.querySelector('h3').innerText.toLowerCase();
        
        // 4. Cek apakah nama produk mengandung kata yang diketik
        if (productName.includes(input)) {
            card.style.display = ""; // Tampilkan jika cocok
            // Tambahkan animasi sedikit agar halus
            card.style.animation = "fadeIn 0.4s ease"; 
        } else {
            card.style.display = "none"; // Sembunyikan jika tidak cocok
        }
    });
}
// --- LOGIKA MODAL VARIAN ---

// 1. Data Master Harga & Pilihan (Atur di sini)
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
    // Masukkan ke dalam const productData = { ... }
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





}

let currentProduct = "";

// 2. Fungsi Membuka Pop-up Varian
function openVariantModal(name) {
    currentProduct = name;
    const data = productData[name];
    
    if (!data) return alert("Varian belum tersedia untuk produk ini.");

    document.getElementById('modal-product-name').innerText = name;
    
    // Isi Dropdown RAM
    const ramSelect = document.getElementById('modal-ram-select');
    ramSelect.innerHTML = data.rams.map(r => `<option value="${r}">${r.toUpperCase()}</option>`).join('');
    
    // Isi Dropdown Warna
    const colorSelect = document.getElementById('modal-color-select');
    colorSelect.innerHTML = data.colors.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('');

    updateModalPrice();
    document.getElementById('variant-modal').style.display = 'block';
}

// 3. Fungsi Update Harga di Dalam Pop-up
function updateModalPrice() {
    const ram = document.getElementById('modal-ram-select').value;
    const color = document.getElementById('modal-color-select').value;
    const price = productData[currentProduct].prices[`${ram}-${color}`];
    
    document.getElementById('modal-price-display').innerText = "Rp " + price.toLocaleString('id-ID');
}

// 4. Konfirmasi Tambah ke Keranjang
function confirmAddToCart() {
    const ram = document.getElementById('modal-ram-select').value;
    const color = document.getElementById('modal-color-select').value;
    const price = productData[currentProduct].prices[`${ram}-${color}`];
    const fullName = `${currentProduct} (${ram.toUpperCase()} - ${color})`;

    // Memanggil fungsi addToCart asli Anda
    addToCart(fullName, price); 
    closeVariantModal();
}

function closeVariantModal() {
    document.getElementById('variant-modal').style.display = 'none';
}