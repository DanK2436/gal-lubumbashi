
import { getAnnouncements } from '../storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('annonces-list');

    if (!listContainer) return;

    try {
        const annonces = await getAnnouncements();

        if (!annonces || annonces.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state text-center py-12">
                    <i class="ri-notification-3-line text-6xl text-gray-200 mb-4 block"></i>
                    <h3 class="text-xl font-semibold text-gray-600">Aucune annonce</h3>
                    <p class="text-gray-400 mt-2">Les communications officielles apparaîtront ici.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = annonces.map(a => `
            <div class="member-section border-l-4 ${getPriorityClass(a.priority)} pl-4" style="margin-bottom:0">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs text-muted font-medium uppercase tracking-wider">${formatDate(a.sent_at)}</span>
                    ${a.priority === 'high' ? '<span class="badge badge--error text-xs">Urgent</span>' : ''}
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">${escapeHtml(a.title || a.subject)}</h3>
                <div class="prose prose-sm text-gray-600">
                    ${escapeHtml(a.content || a.message).replace(/\n/g, '<br>')}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erreur chargement annonces:', error);
        listContainer.innerHTML = `<div class="p-4 text-center text-red-500">Erreur de connexion.</div>`;
    }
});

function getPriorityClass(priority) {
    if (priority === 'high') return 'border-red-500';
    if (priority === 'medium') return 'border-orange-400';
    return 'border-blue-500'; // Default normal
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
