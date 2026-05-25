// ================= INITIALIZE ICONS =================
// Ejecutamos al inicio y también cuando el DOM esté listo para asegurar el Footer
lucide.createIcons();
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// ================= CONFIG =================
const WHATSAPP_NUMBER = "59161137776";

// ================= CART =================
let cart = JSON.parse(localStorage.getItem('sensus_cart')) || [];

// ================= UPDATE CART UI =================
function updateCartUI() {

    const container = document.getElementById('cart-items-container');
    if (!container) return;

    container.innerHTML = '';

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        count += item.quantity;

        container.innerHTML += `
            <div class="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">

                <img src="${item.img}" class="w-12 h-16 object-cover rounded">

                <div class="flex-grow">

                    <h4 class="text-xs font-bold text-sensus-dark">
                        ${item.title}
                    </h4>

                    <p class="text-xs text-sensus-accent">
                        ${item.price} Bs
                    </p>

                    <div class="flex items-center gap-2 mt-1">

                        <button onclick="changeQty(${index}, -1)"
                            class="px-2 border rounded">-</button>

                        <span class="text-xs">${item.quantity}</span>

                        <button onclick="changeQty(${index}, 1)"
                            class="px-2 border rounded">+</button>

                    </div>
                </div>

                <button onclick="removeItem(${index})"
                    class="text-red-400">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>

            </div>
        `;
    });

    const totalElement = document.getElementById('cart-total');
    const countElement = document.getElementById('cart-count-nav');

    if (totalElement) totalElement.innerText = `${total} Bs`;
    if (countElement) countElement.innerText = count;

    localStorage.setItem('sensus_cart', JSON.stringify(cart));

    // Esto reactiva los iconos dentro del carrito cada vez que se actualiza
    lucide.createIcons();
}

// ================= ADD TO CART =================
function addToCart(card) {

    const title = card.dataset.title;
    const priceText = card.querySelector('.price-tag').innerText;
    const priceVal = parseInt(priceText);
    const img = card.querySelector('img').src;

    if (isNaN(priceVal)) {
        alert("Consulta disponibilidad por WhatsApp");
        return;
    }

    const existing = cart.find(i => i.title === title);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            title,
            price: priceVal,
            img,
            quantity: 1
        });
    }

    updateCartUI();

    document.getElementById('cart-modal')?.classList.remove('hidden');
}

// ================= GLOBAL FUNCTIONS =================
window.changeQty = (i, d) => {
    cart[i].quantity += d;

    if (cart[i].quantity < 1) {
        removeItem(i);
    } else {
        updateCartUI();
    }
};

window.removeItem = (i) => {
    cart.splice(i, 1);
    updateCartUI();
};

// ================= ADD TO CART BUTTONS =================
document.addEventListener('click', (e) => {

    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;

    addToCart(btn.closest('.product-card'));
});

// ================= CART MODAL =================
document.getElementById('cart-trigger')?.addEventListener('click', () => {
    document.getElementById('cart-modal')?.classList.remove('hidden');
});

document.getElementById('close-cart')?.addEventListener('click', () => {
    document.getElementById('cart-modal')?.classList.add('hidden');
});

document.getElementById('cart-overlay')?.addEventListener('click', () => {
    document.getElementById('cart-modal')?.classList.add('hidden');
});

// ================= WHATSAPP =================
document.getElementById('btn-whatsapp')?.addEventListener('click', () => {

    if (cart.length === 0) {
        alert("Carrito vacío");
        return;
    }

    let msg = "¡Hola Sensus Divinitatis! Quisiera estos libros:\n\n";

    cart.forEach(i => {
        msg += `• ${i.title} (x${i.quantity}) - ${i.price * i.quantity} Bs\n`;
    });

    msg += `\n*Total: ${document.getElementById('cart-total').innerText}*`;

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        '_blank'
    );
});

// ================= SEARCH =================
document.getElementById('shop-search')?.addEventListener('input', (e) => {

    const q = e.target.value.toLowerCase();
    let v = 0;

    document.querySelectorAll('.product-card').forEach(p => {

        const match =
            p.dataset.title.toLowerCase().includes(q) ||
            p.dataset.category.toLowerCase().includes(q);

        p.style.display = match ? '' : 'none';

        if (match) v++;
    });

    document.getElementById('products-count').innerText = `${v} resultados`;
});
