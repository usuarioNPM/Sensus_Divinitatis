import { GoogleGenAI } from "@google/genai";

// --- MENÚ MÓVIL ---
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                openIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    }

    // --- CARRUSEL HOME (Solo si existe en la página) ---
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.remove('hidden');
                    slide.classList.add('fade-in');
                } else {
                    slide.classList.add('hidden');
                    slide.classList.remove('fade-in');
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }

        // Auto avance
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // --- FILTRO TIENDA (Solo si existe en la página) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('shop-search');
    const productsCount = document.getElementById('products-count');

    function filterProducts() {
        if (!products.length) return;
        
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
        let count = 0;

        products.forEach(product => {
            const title = product.dataset.title.toLowerCase();
            const category = product.dataset.category;
            const matchesSearch = title.includes(term);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                product.classList.remove('hidden');
                count++;
            } else {
                product.classList.add('hidden');
            }
        });

        if (productsCount) productsCount.innerText = `${count} resultados`;
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase activa de todos
                filterButtons.forEach(b => {
                    b.classList.remove('bg-sensus-dark', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-600');
                    b.classList.remove('active');
                });
                // Añadir a actual
                btn.classList.remove('bg-gray-100', 'text-gray-600');
                btn.classList.add('bg-sensus-dark', 'text-white');
                btn.classList.add('active');
                
                filterProducts();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', filterProducts);
        }
    }

    // --- CHAT IA ---
    const chatBtn = document.getElementById('chat-toggle');
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    let aiClient = null;
    const API_KEY = process.env.API_KEY;
    
    if (API_KEY) {
            aiClient = new GoogleGenAI({ apiKey: API_KEY });
    }

    if (chatBtn && chatModal) {
        chatBtn.addEventListener('click', () => {
            chatModal.classList.remove('hidden');
        });
        chatClose.addEventListener('click', () => {
            chatModal.classList.add('hidden');
        });

        async function sendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            // Añadir mensaje usuario
            appendMessage(text, 'user');
            chatInput.value = '';

            // Loading
            const loadingId = appendMessage('Escribiendo...', 'ai', true);

            try {
                if (!aiClient) {
                    throw new Error("API Key no configurada");
                }
                const response = await aiClient.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Eres un asistente experto de la librería 'Sensus Divinitatis'. 
                    Nuestra misión es difundir conocimiento histórico y filosófico.
                    El usuario pregunta: "${text}".
                    Recomienda un tipo de libro o curso que podríamos tener (historia, filosofía, teología) de forma breve y amable en español.`
                });
                
                removeMessage(loadingId);
                appendMessage(response.text || "No pude generar respuesta.", 'ai');
            } catch (error) {
                console.error(error);
                removeMessage(loadingId);
                appendMessage("Lo siento, el servicio de IA no está disponible en este momento (Verifica API Key).", 'ai');
            }
        }

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function appendMessage(text, role, isLoading = false) {
        const div = document.createElement('div');
        div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
        const id = 'msg-' + Date.now();
        if (isLoading) div.id = id;
        
        div.innerHTML = `
            <div class="max-w-[80%] p-3 rounded-lg text-sm ${role === 'user' ? 'chat-message-user' : 'chat-message-ai'}">
                ${text}
            </div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});