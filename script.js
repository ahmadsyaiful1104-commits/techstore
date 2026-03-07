
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
    if (cart.length === 0) return alert("Keranjang kosong!");
    let text = "Halo TechStore, saya ingin pesan:\n" + cart.map(i => `- ${i.name}`).join("\n");
    window.open("https://wa.me/628123456789?text=" + encodeURIComponent(text));
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