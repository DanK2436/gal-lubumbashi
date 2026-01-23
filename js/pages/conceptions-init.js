
import { getProjects } from '../storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('conceptions-list');

    if (!listContainer) return;

    try {
        const conceptions = await getProjects('conceptions'); // type='conceptions' -> mapping to 'conception' in storage

        if (!conceptions || conceptions.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state text-center py-12">
                    <i class="ri-pencil-ruler-2-line text-6xl text-gray-200 mb-4 block"></i>
                    <h3 class="text-xl font-semibold text-gray-600">Aucune conception disponible</h3>
                    <p class="text-gray-400 mt-2">Vos projets de conception s'afficheront ici.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = conceptions.map(c => `
            <div class="member-section relative overflow-hidden transition-all duration-300 hover:shadow-md" style="margin-bottom:0">
                <div class="member-section__header border-b-0 pb-2">
                     <div class="d-flex justify-between items-center w-full">
                        <span class="badge badge--info mb-2 text-xs">Conception</span>
                        <span class="text-xs text-muted">${formatDate(c.created_at)}</span>
                     </div>
                     <h3 class="text-xl font-bold text-gray-800 m-0">${escapeHtml(c.title)}</h3>
                </div>
                
                <!-- Placeholder image si pas d'image -->
                <div class="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300">
                    <i class="ri-image-line text-4xl"></i>
                    <!-- ${c.image_url ? `<img src="${c.image_url}" class="w-full h-full object-cover rounded-lg">` : ''} -->
                </div>

                <p class="text-gray-600 mb-4 line-clamp-3 text-sm">${escapeHtml(c.description || '')}</p>
                
                <div class="flex justify-between items-center pt-2">
                    <button class="member-btn member-btn--outline member-btn--sm w-full justify-center">
                        Voir le dossier
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erreur chargement conceptions:', error);
        listContainer.innerHTML = `
            <div class="empty-state text-center py-8">
                <i class="ri-error-warning-line text-4xl text-red-400 mb-2 block"></i>
                <p class="text-red-500">Erreur de chargement.</p>
            </div>`;
    }
});

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
