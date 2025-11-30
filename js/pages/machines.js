import { getMachines, saveReservation, initStorage } from '../storage.js';
import { t, initI18n } from '../i18n.js';
import { showToast } from '../ui.js';

let allMachines = [];
let currentCategory = 'all';

// Create machine card
function createMachineCard(machine) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group';

    div.innerHTML = `
        <div class="relative h-64 overflow-hidden bg-gray-100">
            <img src="${machine.image || 'https://placehold.co/600x400?text=Machine'}" 
                 alt="${machine.name}" 
                 class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-red-700 shadow-sm">
                ${machine.priceRange || 'Sur devis'}
            </div>
            
            <div class="absolute top-4 left-4">
                <span class="bg-red-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                    ${machine.category}
                </span>
            </div>

            ${machine.status ? `
                <div class="absolute bottom-4 left-4">
                    <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${machine.status === 'Disponible' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}">
                        ${machine.status}
                    </span>
                </div>
            ` : ''}
        </div>
        
        <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors">${machine.name}</h3>
            
            ${machine.specs && machine.specs.length > 0 ? `
                <div class="mb-6 space-y-2">
                    ${machine.specs.slice(0, 3).map(spec => `
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">${spec.label}</span>
                            <span class="font-medium text-gray-900">${spec.value}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="mt-auto pt-4 border-t border-gray-100">
                <button class="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-bold uppercase text-sm tracking-wide hover:bg-red-700 transition-colors flex items-center justify-center gap-2 group btn-reserve" data-id="${machine.id}" data-name="${machine.name}">
                    Réserver
                    <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Add event listener for reservation
    const btn = div.querySelector('.btn-reserve');
    btn.addEventListener('click', () => openReservationModal(machine));

    return div;
}

// Open reservation modal
function openReservationModal(machine) {
    let modal = document.getElementById('reservation-modal');
    if (!modal) {
        createReservationModal();
        modal = document.getElementById('reservation-modal');
    }

    const form = document.getElementById('reservation-form');
    document.getElementById('reservation-machine-id').value = machine.id;
    document.getElementById('reservation-machine-name').value = machine.name;
    document.getElementById('modal-machine-title').textContent = machine.name;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Create modal HTML
function createReservationModal() {
    const div = document.createElement('div');
    div.id = 'reservation-modal';
    div.className = 'fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4 backdrop-blur-sm';
    div.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div class="bg-red-700 px-6 py-4 flex justify-between items-center">
                <h3 class="text-white font-bold text-lg">Réserver une machine</h3>
                <button id="close-modal" class="text-white hover:text-gray-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <p class="text-gray-600 mb-4">Vous souhaitez réserver : <span id="modal-machine-title" class="font-bold text-gray-900"></span></p>
                <form id="reservation-form" class="space-y-4">
                    <input type="hidden" id="reservation-machine-id">
                    <input type="hidden" id="reservation-machine-name">
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Votre Nom</label>
                        <input type="text" id="reservation-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="reservation-email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input type="tel" id="reservation-phone" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                        <input type="date" id="reservation-date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all">
                    </div>

                    <button type="submit" class="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-red-700/30">
                        Confirmer la réservation
                    </button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    // Close handlers
    document.getElementById('close-modal').addEventListener('click', closeReservationModal);
    div.addEventListener('click', (e) => {
        if (e.target === div) closeReservationModal();
    });

    // Form submit
    document.getElementById('reservation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Envoi en cours...';

        const data = {
            machineId: document.getElementById('reservation-machine-id').value,
            machineName: document.getElementById('reservation-machine-name').value,
            userName: document.getElementById('reservation-name').value,
            userEmail: document.getElementById('reservation-email').value,
            userPhone: document.getElementById('reservation-phone').value,
            reservationDate: document.getElementById('reservation-date').value
        };

        try {
            await saveReservation(data);
            showToast('🎉 Votre demande de réservation a été enregistrée avec succès ! Nous vous contacterons bientôt.', 'success', 6000);
            closeReservationModal();
            e.target.reset();
        } catch (error) {
            console.error(error);
            showToast('❌ Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}

function closeReservationModal() {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Render machines
function renderMachines(machines) {
    const container = document.getElementById('machines-container');
    if (!container) return;

    container.innerHTML = '';

    if (machines.length === 0) {
        container.innerHTML = `
            <div class="text-center col-span-full py-12">
                <p class="mt-4 text-gray-500 font-medium">Aucune machine disponible pour cette catégorie.</p>
            </div>
        `;
        return;
    }

    machines.forEach(machine => {
        container.appendChild(createMachineCard(machine));
    });
}

// Filter machines
function filterMachines(category) {
    currentCategory = category;
    const filtered = category === 'all'
        ? allMachines
        : allMachines.filter(m => m.category === category);
    renderMachines(filtered);

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.remove('border-gray-300', 'text-gray-700');
            btn.classList.add('border-red-700', 'bg-red-700', 'text-white');
        } else {
            btn.classList.remove('border-red-700', 'bg-red-700', 'text-white');
            btn.classList.add('border-gray-300', 'text-gray-700');
        }
    });
}

// Load machines
async function loadMachinesData() {
    initStorage();
    const container = document.getElementById('machines-container');
    if (!container) return;

    try {
        allMachines = await getMachines();
        renderMachines(allMachines);
    } catch (error) {
        console.error('Erreur chargement machines:', error);
        container.innerHTML = '<div class="text-center text-red-500 py-12">Erreur lors du chargement du catalogue.</div>';
    }
}

export function init() {
    console.log('⚙️ Initializing machines page');
    loadMachinesData();

    // Attach filter listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterMachines(btn.dataset.category);
        });
    });
}

// Auto-initialize if imported directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
