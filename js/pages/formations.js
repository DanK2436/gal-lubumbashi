import { getFormations, initStorage } from '../storage.js';
import { showToast } from '../ui.js';
import { t, initI18n } from '../i18n.js';

let allFormations = [];

// Create formation card
function createFormationCard(formation) {
    const div = document.createElement('div');
    div.className = 'bg-white border-l-4 border-red-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-8 items-center';

    div.innerHTML = `
        <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">${formation.title}</h3>
            <p class="text-gray-600 mb-4">${formation.description}</p>
            <div class="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                <span class="flex items-center gap-1">
                    <svg class="h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Certificat Inclus
                </span>
                <span class="flex items-center gap-1">
                    <svg class="h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    ${formation.duration}
                </span>
                <span class="flex items-center gap-1">
                    <svg class="h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    ${formation.level || 'Tous niveaux'}
                </span>
            </div>
            ${formation.modules ? `
                <div class="mt-4 pt-4 border-t border-gray-100">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Modules inclus :</p>
                    <ul class="list-disc list-inside text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-1">
                        ${formation.modules.slice(0, 4).map(m => `<li>${m}</li>`).join('')}
                        ${formation.modules.length > 4 ? `<li>+ ${formation.modules.length - 4} autres...</li>` : ''}
                    </ul>
                </div>
            ` : ''}
        </div>
        <div class="text-right flex-shrink-0 w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end gap-4">
            <div class="text-3xl font-black text-gray-900">${formation.price}</div>
            <button class="bg-gray-900 text-white px-6 py-3 font-bold uppercase text-sm hover:bg-red-700 transition-colors whitespace-nowrap w-full md:w-auto" onclick="showReservationModal('${formation.id}')">
                Réserver
            </button>
        </div>
    `;

    return div;
}

// Load formations
async function loadFormations() {
    initStorage();
    const container = document.getElementById('formations-container');
    if (!container) return;

    try {
        allFormations = await getFormations();
        renderFormations();
    } catch (error) {
        console.error('Erreur chargement formations:', error);
        container.innerHTML = '<div class="text-center text-red-500 py-12">Erreur lors du chargement des formations.</div>';
    }
}

// Render formations
function renderFormations() {
    const container = document.getElementById('formations-container');
    if (!container) return;

    if (allFormations.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-12">Aucune formation disponible pour le moment.</div>';
        return;
    }

    container.innerHTML = '';
    allFormations.forEach(formation => {
        container.appendChild(createFormationCard(formation));
    });
}

export function init() {
    console.log('📚 Initializing formations page');
    loadFormations();

    // Global function for reservation button
    window.showReservationModal = (id) => {
        showToast('Fonctionnalité de réservation bientôt disponible', 'info');
    };
}

// Auto-initialize
initI18n().then(init);
