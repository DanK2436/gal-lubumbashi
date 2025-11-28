import { getMachines, initStorage } from '../storage.js';
import { buildWhatsAppLink } from '../whatsapp.js';
import { t } from '../i18n.js';

let allMachines = [];

// Create machine card
function createMachineCard(machine, index) {
    const isReverse = index % 2 !== 0;
    const specsHtml = machine.specs ? `
        <ul class="space-y-3 mb-8">
            ${Object.entries(machine.specs).map(([key, value]) => `
                <li class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-red-700"></div>
                    <span class="font-bold text-gray-800">${key}: ${value}</span>
                </li>
            `).join('')}
        </ul>
    ` : '';

    const div = document.createElement('div');
    div.className = `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:flex-row-reverse' : ''}`;

    div.innerHTML = `
        <div class="${isReverse ? 'lg:order-2' : ''} bg-gray-100 h-96 w-full flex items-center justify-center">
            <img src="${machine.image || 'https://picsum.photos/600/600?random=' + machine.id}" alt="${machine.name}"
                class="h-full w-full object-cover mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-500">
        </div>
        <div class="${isReverse ? 'lg:order-1' : ''}">
            <h2 class="text-3xl font-black text-gray-900 mb-4 uppercase">${machine.name}</h2>
            <div class="h-1 w-20 bg-red-700 mb-6"></div>
            <p class="text-gray-600 text-lg leading-relaxed mb-8">
                ${machine.description}
            </p>
            ${specsHtml}
            <button class="bg-red-700 text-white px-8 py-3 font-bold uppercase hover:bg-red-800 transition-colors" data-machine-id="${machine.id}">
                Fiche Technique
            </button>
        </div>
    `;

    // WhatsApp click handler
    div.querySelector('button').addEventListener('click', () => {
        const message = `Bonjour, je suis intéressé par la machine : ${machine.name}`;
        const url = buildWhatsAppLink('243979022998', message);
        window.open(url, '_blank');
    });

    return div;
}

// Load machines
async function loadMachines() {
    initStorage();
    const container = document.getElementById('machines-container');
    if (!container) return;

    try {
        allMachines = await getMachines();
        renderMachines();
    } catch (error) {
        console.error('Erreur chargement machines:', error);
        container.innerHTML = '<div class="text-center text-red-500 py-12">Erreur lors du chargement du catalogue.</div>';
    }
}

// Render machines
function renderMachines() {
    const container = document.getElementById('machines-container');
    if (!container) return;

    if (allMachines.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-12">Aucune machine disponible pour le moment.</div>';
        return;
    }

    container.innerHTML = '';
    allMachines.forEach((machine, index) => {
        container.appendChild(createMachineCard(machine, index));
    });
}

export function init() {
    console.log('⚙️ Initializing machines page');
    loadMachines();
}
