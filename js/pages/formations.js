import { getFormations, initStorage, saveFormationRegistration } from '../storage.js';
import { showToast, sanitizeHTML } from '../ui.js';
import { t, initI18n } from '../i18n.js';

let allFormations = [];
let currentCategory = 'all';

// Create formation card
function createFormationCard(formation) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full';

    const safeTitle = sanitizeHTML(formation.title);
    const safeDescription = sanitizeHTML(formation.description);
    const safeCategory = sanitizeHTML(formation.category || 'Formation'); // Fallback
    const safePrice = sanitizeHTML(formation.price || 'Sur devis');
    const safeDuration = sanitizeHTML(formation.duration || 'Durée variable');
    const safeLevel = sanitizeHTML(formation.level || 'Tous niveaux');

    div.innerHTML = `
        <div class="relative h-48 overflow-hidden">
            <img src="${formation.image || 'https://placehold.co/600x400?text=Formation'}" 
                 alt="${safeTitle}" 
                 class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-red-700 shadow-sm">
                ${safePrice}
            </div>
            <div class="absolute top-4 left-4">
                <span class="bg-red-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                    ${safeCategory}
                </span>
            </div>
        </div>
        
        <div class="p-6 flex-grow flex flex-col">
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <i class="ri-time-line"></i>
                <span>${safeDuration}</span>
                <span class="mx-2">•</span>
                <i class="ri-bar-chart-fill"></i>
                <span>${safeLevel}</span>
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">${safeTitle}</h3>
            <p class="text-gray-600 mb-4 line-clamp-3 flex-grow">${safeDescription}</p>
            
            <div class="mt-auto pt-4 border-t border-gray-100">
                <button class="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-bold uppercase text-sm tracking-wide hover:bg-red-700 transition-colors flex items-center justify-center gap-2 group" onclick="showReservationModal('${formation.id}')">
                    Réserver
                    <i class="ri-arrow-right-line transform group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        </div>
    `;

    return div;
}

// Load formations
async function loadFormations() {
    await initStorage();
    const container = document.getElementById('formations-container');
    if (!container) return;

    try {
        allFormations = await getFormations();
        renderFormations();
        setupFilters();
    } catch (error) {
        console.error('Erreur chargement formations:', error);
        container.innerHTML = '<div class="text-center text-red-500 py-12">Erreur lors du chargement des formations.</div>';
    }
}

// Render formations
function renderFormations() {
    const container = document.getElementById('formations-container');
    if (!container) return;

    const filtered = currentCategory === 'all'
        ? allFormations
        : allFormations.filter(f => f.category === currentCategory);

    if (!filtered || filtered.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-12">Aucune formation disponible pour cette catégorie.</div>';
        return;
    }

    container.innerHTML = '';
    filtered.forEach(formation => {
        container.appendChild(createFormationCard(formation));
    });
}

// Setup filters
function setupFilters() {
    const container = document.getElementById('formation-filters');
    if (!container || !allFormations.length) return;

    const categories = ['all', ...new Set(allFormations.map(f => f.category))].filter(Boolean);

    container.innerHTML = categories.map(cat => `
        <button class="filter-btn px-6 py-2 font-bold uppercase text-sm tracking-wider border-2 transition-all ${currentCategory === cat ? 'border-red-700 bg-red-700 text-white' : 'border-gray-300 text-gray-700 hover:border-red-700 hover:text-red-700'}"
            data-category="${cat}">
            ${cat === 'all' ? 'Toutes' : cat}
        </button>
    `).join('');

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            renderFormations();
            setupFilters();
        });
    });
}

export function init() {
    console.log('📚 Initializing formations page');
    loadFormations();

    // Global function for reservation button
    window.showReservationModal = (id) => {
        const formation = allFormations.find(f => f.id === id);
        if (!formation) return;

        const modalHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Réserver une formation</h2>
                <p class="text-gray-600">${formation.title}</p>
                <p class="text-red-700 font-bold text-xl mt-2">${formation.price || 'Sur devis'}</p>
            </div>
            <form id="reservation-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nom complet *</label>
                    <input type="text" required name="fullName"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-700 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                    <input type="email" required name="email"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-700 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Téléphone *</label>
                    <input type="tel" required name="phone"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-700 transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Message (optionnel)</label>
                    <textarea name="message" rows="3"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-700 transition-colors"></textarea>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="button" id="cancel-reservation" 
                        class="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                        Annuler
                    </button>
                    <button type="submit"
                        class="flex-1 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition-colors">
                        Confirmer la réservation
                    </button>
                </div>
            </form>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center';
        modalDiv.innerHTML = `
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                ${modalHTML}
            </div>
        `;

        document.body.appendChild(modalDiv);
        document.body.style.overflow = 'hidden';

        const closeModal = () => {
            modalDiv.remove();
            document.body.style.overflow = '';
        };

        modalDiv.querySelector('.absolute').addEventListener('click', closeModal);
        modalDiv.querySelector('#cancel-reservation').addEventListener('click', closeModal);

        modalDiv.querySelector('#reservation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const registrationData = {
                formation_id: id,
                formation_title: formation.title || 'Formation sans titre',
                level: formation.level || 'Non spécifié',
                name: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message') || '',
                created_at: new Date().toISOString(),
                status: 'pending'
            };

            console.log('📝 Tentative d\'inscription:', registrationData);

            try {
                await saveFormationRegistration(registrationData);
                console.log('✅ Inscription sauvegardée avec succès');
                showToast(`🎉 Merci ${registrationData.userName}! Demande envoyée.`, 'success', 6000);
                closeModal();
            } catch (error) {
                console.error('❌ Erreur lors de la sauvegarde:', error);
                const errorMessage = error.message || 'Une erreur est survenue.';
                showToast(`❌ Erreur : ${errorMessage}`, 'error', 5000);
            }
        });
    };
}

// Auto-initialize
initI18n().then(init);
