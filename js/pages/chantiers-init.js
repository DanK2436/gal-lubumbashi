
import { getProjects } from '../storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('chantiers-list');

    // Attendre un peu pour simuler chargement (optionnel) ou éviter FOUC
    if (!listContainer) return;

    try {
        const chantiers = await getProjects('chantiers');

        if (!chantiers || chantiers.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state text-center py-12">
                    <i class="ri-building-2-line text-6xl text-gray-200 mb-4 block"></i>
                    <h3 class="text-xl font-semibold text-gray-600">Aucun chantier disponible</h3>
                    <p class="text-gray-400 mt-2">Les nouveaux chantiers apparaîtront ici.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = chantiers.map(c => `
            <div class="member-section relative overflow-hidden group hover:shadow-lg transition-all duration-300" style="margin-bottom:0">
                <div class="member-section__header border-b-0 pb-2">
                    <div class="d-flex justify-between items-start w-full flex-wrap gap-2">
                        <div>
                             <span class="badge ${getStatusBadgeClass(c.status)} mb-2 inline-block">${getStatusLabel(c.status)}</span>
                             <h3 class="text-xl font-bold text-gray-800 m-0">${escapeHtml(c.title)}</h3>
                        </div>
                        <div class="text-right">
                             <span class="text-sm font-bold text-primary block">${escapeHtml(c.budget || 'Budget N/C')}</span>
                             <span class="text-xs text-muted">${formatDate(c.created_at)}</span>
                        </div>
                    </div>
                </div>
                <p class="article-content mb-4 line-clamp-3">${escapeHtml(c.description || 'Pas de description')}</p>
                
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div class="flex gap-4 text-sm text-gray-500">
                        <span class="flex items-center gap-1"><i class="ri-map-pin-line"></i> ${escapeHtml(c.location || 'Lubumbashi')}</span>
                        <span class="flex items-center gap-1"><i class="ri-calendar-event-line"></i> ${c.deadline ? 'Fin: ' + formatDate(c.deadline) : 'Pas de date limite'}</span>
                    </div>
                    <button class="member-btn member-btn--primary member-btn--sm" onclick="alert('Détails complets bientôt disponibles')">
                        Voir détails <i class="ri-arrow-right-line"></i>
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erreur chargement chantiers:', error);
        listContainer.innerHTML = `
            <div class="empty-state text-center py-8">
                <i class="ri-error-warning-line text-4xl text-red-400 mb-2 block"></i>
                <p class="text-red-500">Impossible de charger les chantiers.</p>
                <button class="member-btn member-btn--outline member-btn--sm mt-4" onclick="window.location.reload()">Réessayer</button>
            </div>`;
    }
});

function getStatusBadgeClass(status) {
    if (status === 'active') return 'badge--success'; // Vert
    if (status === 'completed') return 'badge--info'; // Bleu
    if (status === 'pending') return 'badge--warning'; // Jaune
    return 'badge--disabled'; // Gris
}

function getStatusLabel(status) {
    const labels = {
        'active': 'En cours',
        'open': 'Ouvert',
        'completed': 'Terminé',
        'pending': 'En attente',
        'draft': 'Brouillon'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
