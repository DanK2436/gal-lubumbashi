
import { getMessagesByRecipient } from '../storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('messages-list');

    if (!listContainer) return;

    // Récupérer l'utilisateur connecté
    const memberDataStr = localStorage.getItem('memberData');
    if (!memberDataStr) {
        // Redirection gérée par member-common normalement
        return;
    }
    const member = JSON.parse(memberDataStr);

    try {
        // On récupère les messages privés et les messages 'all' (si getMessagesByRecipient gère 'all', sinon il faut deux appels)
        // Supposons que getMessagesByRecipient gère tout (voir storage.js : "OR recipient_id = 'all'")
        // Note: storage.js getMessagesByRecipient filtre par 'eq', donc il faut peut être modifier storage, ou faire 2 requêtes.
        // Pour l'instant on fait simple : messages privés.

        const messages = await getMessagesByRecipient(member.id);

        if (!messages || messages.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state text-center py-12">
                    <i class="ri-message-3-line text-6xl text-gray-200 mb-4 block"></i>
                    <h3 class="text-xl font-semibold text-gray-600">Aucun message</h3>
                    <p class="text-gray-400 mt-2">Votre boîte de réception est vide.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = messages.map(m => `
            <div class="member-section ${m.read ? 'opacity-75' : 'bg-white shadow-md'} cursor-pointer hover:bg-gray-50 transition-colors" style="margin-bottom:0">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        ${(m.sender || 'A').charAt(0)}
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center mb-1">
                            <h4 class="font-bold text-gray-800 ${!m.read ? 'text-primary' : ''}">${escapeHtml(m.subject)}</h4>
                            <span class="text-xs text-gray-400">${getTimeAgo(m.sent_at)}</span>
                        </div>
                        <p class="text-sm text-gray-600 line-clamp-2">${escapeHtml(m.content || m.message)}</p>
                    </div>
                    ${!m.read ? '<div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>' : ''}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erreur chargement messages:', error);
        listContainer.innerHTML = `<div class="p-4 text-center text-red-500">Erreur lors du chargement des messages.</div>`;
    }
});

function getTimeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'À l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} j`;

    return date.toLocaleDateString('fr-FR');
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
