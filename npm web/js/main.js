lucide.createIcons();

// ================= CONFIG =================
const WHATSAPP_NUMBER = "59161137776";

// ================= CART =================
let cart = JSON.parse(localStorage.getItem('sensus_cart')) || [];

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

                <img src="${item.img}"
                     class="w-12 h-16 object-cover rounded">

                <div class="flex-grow">

                    <h4 class="text-xs font-bold text-sensus-dark">
                        ${item.title}
                    </h4>

                    <p class="text-xs text-sensus-accent">
                        ${item.price} Bs
                    </p>

                    <div class="flex items-center gap-2 mt-1">

                        <button onclick="changeQty(${index}, -1)"
                            class="px-2 border rounded">
                            -
                        </button>

                        <span class="text-xs">
                            ${item.quantity}
                        </span>

                        <button onclick="changeQty(${index}, 1)"
                            class="px-2 border rounded">
                            +
                        </button>

                    </div>
                </div>

                <button onclick="removeItem(${index})"
                    class="text-red-400">

                    <i data-lucide="trash-2"
                       class="w-4 h-4"></i>

                </button>

            </div>
        `;
    });

    const totalElement =
        document.getElementById('cart-total');

    const countElement =
        document.getElementById('cart-count-nav');

    if (totalElement) {
        totalElement.innerText = `${total} Bs`;
    }

    if (countElement) {
        countElement.innerText = count;
    }

    localStorage.setItem(
        'sensus_cart',
        JSON.stringify(cart)
    );

    lucide.createIcons();
}

// ================= ADD TO CART =================
function addToCart(card) {

    const title = card.dataset.title;

    const priceText =
        card.querySelector('.price-tag').innerText;

    const priceVal = parseInt(priceText);

    const img =
        card.querySelector('img').src;

    if (isNaN(priceVal)) {

        alert("Consulta disponibilidad por WhatsApp");

        return;
    }

    const existing =
        cart.find(i => i.title === title);

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

    const cartModal =
        document.getElementById('cart-modal');

    if (cartModal) {
        cartModal.classList.remove('hidden');
    }
}

// ================= CHANGE QTY =================
window.changeQty = (i, d) => {

    cart[i].quantity += d;

    if (cart[i].quantity < 1) {

        removeItem(i);

    } else {

        updateCartUI();
    }
};

// ================= REMOVE ITEM =================
window.removeItem = (i) => {

    cart.splice(i, 1);

    updateCartUI();
};

// ================= ADD TO CART BUTTONS =================
document.querySelectorAll('.add-to-cart-btn')
.forEach(button => {

    button.onclick = () => {

        addToCart(
            button.closest('.product-card')
        );
    };
});

// ================= CART MODAL =================
const cartTrigger =
    document.getElementById('cart-trigger');

const closeCart =
    document.getElementById('close-cart');

const cartOverlay =
    document.getElementById('cart-overlay');

const cartModal =
    document.getElementById('cart-modal');

if (cartTrigger && cartModal) {

    cartTrigger.onclick = () => {

        cartModal.classList.remove('hidden');
    };
}

if (closeCart && cartModal) {

    closeCart.onclick = () => {

        cartModal.classList.add('hidden');
    };
}

if (cartOverlay && cartModal) {

    cartOverlay.onclick = () => {

        cartModal.classList.add('hidden');
    };
}

// ================= WHATSAPP =================
const whatsappBtn =
    document.getElementById('btn-whatsapp');

if (whatsappBtn) {

    whatsappBtn.onclick = () => {

        if (cart.length === 0) {

            alert("Carrito vacío");

            return;
        }

        let msg =
            "¡Hola Sensus Divinitatis! Quisiera estos libros:\n\n";

        cart.forEach(i => {

            msg +=
                `• ${i.title} (x${i.quantity}) - ${i.price * i.quantity} Bs\n`;
        });

        const totalText =
            document.getElementById('cart-total')?.innerText || '';

        msg += `\n*Total a pagar: ${totalText}*`;

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
            '_blank'
        );
    };
}

// ================= SEARCH =================
const searchInput =
    document.getElementById('shop-search');

if (searchInput) {

    searchInput.addEventListener('input', function (e) {

        const q =
            e.target.value.toLowerCase();

        let v = 0;

        document.querySelectorAll('.product-card')
        .forEach(p => {

            const match =
                p.dataset.title.toLowerCase().includes(q) ||
                p.dataset.category.toLowerCase().includes(q);

            p.style.display = match ? '' : 'none';

            if (match) v++;
        });

        const results =
            document.getElementById('products-count');

        if (results) {

            results.innerText =
                `${v} resultados`;
        }
    });
}

// ================= NUEVO HERO CAROUSEL =================

// ================= NUEVO HERO CAROUSEL =================

const carousel = document.getElementById("carousel");

const slides = document.querySelectorAll("#carousel > div");

const nextBtn = document.getElementById("next-slide");

const prevBtn = document.getElementById("prev-slide");

let index = 0;

function updateCarousel() {

    carousel.style.transform =
        `translateX(-${index * 100}%)`;
}

// BOTÓN SIGUIENTE
if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        index++;

        if (index >= slides.length) {
            index = 0;
        }

        updateCarousel();
    });
}

// BOTÓN ANTERIOR
if (prevBtn) {

    prevBtn.addEventListener("click", () => {

        index--;

        if (index < 0) {
            index = slides.length - 1;
        }

        updateCarousel();
    });
}

// AUTO PLAY
if (slides.length > 0) {

    setInterval(() => {

        index++;

        if (index >= slides.length) {
            index = 0;
        }

        updateCarousel();

    }, 5000);
}
// ================= MOBILE MENU =================
const mobileBtn =
    document.getElementById('mobile-menu-btn');

const mobileMenu =
    document.getElementById('mobile-menu');

const menuOpen =
    document.getElementById('menu-icon-open');

const menuClose =
    document.getElementById('menu-icon-close');

if (mobileBtn && mobileMenu) {

    mobileBtn.addEventListener('click', () => {

        mobileMenu.classList.toggle('hidden');

        if (menuOpen) {
            menuOpen.classList.toggle('hidden');
        }

        if (menuClose) {
            menuClose.classList.toggle('hidden');
        }
    });
}

// ================= INIT =================
updateCartUI();

lucide.createIcons();