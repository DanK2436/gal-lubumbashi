/**
 * messages.js - Affichage des messages dans l'espace membre
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { getCurrentMember } from './auth.js';
import { showToast } from '../../js/ui.js';

/**
 * Charger et afficher les messages
 */
export function init() {
    loadMessages();
    checkForNewMessages();
}

/**
 * Charger les messages depuis le localStorage
 */
function loadMessages() {
    const currentMember = getCurrentMember();
    if (!currentMember) return;

    const allMessages = JSON.parse(localStorage.getItem('gal_messages') || '[]');
    const container = document.getElementById('messages-list');

    if (!container) return;

    // Filtrer les messages pour ce membre
    const memberMessages = allMessages.filter(msg =>
        msg.recipientId === currentMember.id || msg.recipientId === 'all'
    );

    if (memberMessages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state__icon">💬</span>
                <h3>Aucun message</h3>
                <p>Les messages de l'administration apparaîtront ici</p>
            </div>
        `;
        return;
    }

    // Trier par date (plus récent en premier)
    memberMessages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    container.innerHTML = memberMessages.map(message => createMessageCard(message)).join('');

    // Initialiser les gestionnaires d'événements pour les commentaires
    initCommentHandlers();
}

/**
 * Créer une carte de message
 */
function createMessageCard(message) {
    const date = formatDate(message.sentAt);
    const isNew = isRecent(message.sentAt, 3); // Nouveau si moins de 3 jours
    const isRead = message.read || false;
    const comments = message.comments || [];
    const currentMember = getCurrentMember();

    return `
        <div class="message-card ${isNew && !isRead ? 'message-card--new' : ''} ${!isRead ? 'message-card--unread' : ''}" data-message-id="${message.id}">
            <div class="message-header">
                <div class="message-meta">
                    <span class="message-icon">💬</span>
                    ${!isRead ? '<span class="badge badge--primary">Non lu</span>' : ''}
                    ${isNew && !isRead ? '<span class="badge badge--warning">Nouveau</span>' : ''}
                    <span class="message-date">${date}</span>
                </div>
            </div>
            <div class="message-body">
                <h3 class="message-title">${escapeHtml(message.subject)}</h3>
                <p class="message-content">${escapeHtml(message.message).replace(/\n/g, '<br>')}</p>
            </div>
            
            <!-- Section Commentaires -->
            <div class="message-comments">
                <div class="comments-header">
                    <h4 class="comments-title">💬 Commentaires (${comments.length})</h4>
                </div>
                
                ${comments.length > 0 ? `
                    <div class="comments-list">
                        ${comments.map(comment => `
                            <div class="comment">
                                <div class="comment-header">
                                    <div class="comment-avatar">${comment.memberName.charAt(0).toUpperCase()}</div>
                                    <div class="comment-meta">
                                        <strong>${escapeHtml(comment.memberName)}</strong>
                                        <span class="comment-date">${formatDate(comment.createdAt)}</span>
                                    </div>
                                </div>
                                <div class="comment-body">
                                    ${escapeHtml(comment.text)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Formulaire d'ajout de commentaire -->
                <div class="comment-form">
                    <textarea 
                        class="comment-input" 
                        placeholder="Ajoutez un commentaire..."
                        rows="2"
                        data-message-id="${message.id}"
                    ></textarea>
                    <button 
                        class="btn btn--primary btn--sm add-comment-btn"
                        data-message-id="${message.id}"
                    >
                        Publier
                    </button>
                </div>
            </div>
            
            ${!isRead ? `
                <div class="message-footer">
                    <button class="btn btn--sm btn--outline" onclick="markAsRead('${message.id}')">
                        Marquer comme lu
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Initialiser les gestionnaires d'événements pour les commentaires
 */
function initCommentHandlers() {
    const addCommentButtons = document.querySelectorAll('.add-comment-btn');

    addCommentButtons.forEach(button => {
        button.addEventListener('click', function () {
            const messageId = this.dataset.messageId;
            const textarea = document.querySelector(`textarea[data-message-id="${messageId}"]`);
            const commentText = textarea.value.trim();

            if (!commentText) {
                showToast('Veuillez saisir un commentaire', 'error');
                return;
            }

            addComment(messageId, commentText);
            textarea.value = '';
        });
    });
}

/**
 * Ajouter un commentaire à un message
 */
function addComment(messageId, commentText) {
    const currentMember = getCurrentMember();
    if (!currentMember) return;

    const allMessages = JSON.parse(localStorage.getItem('gal_messages') || '[]');
    const message = allMessages.find(m => m.id === messageId);

    if (!message) {
        showToast('Message introuvable', 'error');
        return;
    }

    // Initialiser le tableau de commentaires si nécessaire
    if (!message.comments) {
        message.comments = [];
    }

    // Créer le nouveau commentaire
    const newComment = {
        id: Date.now().toString(),
        memberId: currentMember.id,
        memberName: currentMember.name,
        text: commentText,
        createdAt: new Date().toISOString()
    };

    // Ajouter le commentaire
    message.comments.push(newComment);

    // Sauvegarder
    localStorage.setItem('gal_messages', JSON.stringify(allMessages));

    // Recharger les messages
    loadMessages();

    showToast('Commentaire ajouté avec succès', 'success');
}

/**
 * Marquer un message comme lu
 */
window.markAsRead = function (messageId) {
    const allMessages = JSON.parse(localStorage.getItem('gal_messages') || '[]');
    const message = allMessages.find(m => m.id === messageId);

    if (message) {
        message.read = true;
        localStorage.setItem('gal_messages', JSON.stringify(allMessages));
        loadMessages();
    }
};

/**
 * Vérifier les nouveaux messages et afficher notification
 */
function checkForNewMessages() {
    const currentMember = getCurrentMember();
    if (!currentMember) return;

    const lastCheck = localStorage.getItem(`lastMessageCheck_${currentMember.id}`);
    const now = new Date().getTime();

    if (lastCheck) {
        const allMessages = JSON.parse(localStorage.getItem('gal_messages') || '[]');
        const newMessages = allMessages.filter(msg =>
            (msg.recipientId === currentMember.id || msg.recipientId === 'all') &&
            new Date(msg.sentAt).getTime() > parseInt(lastCheck)
        );

        if (newMessages.length > 0) {
            playNotificationSound();
            showToast(`Vous avez ${newMessages.length} nouveau(x) message(s)`, 'info');
        }
    }

    localStorage.setItem(`lastMessageCheck_${currentMember.id}`, now.toString());
}

/**
 * Jouer le son de notification
 */
function playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSWAy/DdkEAKFF604OyhVBQKRp/g8r5sIQUlgMvw3ZBACV==');
    audio.play().catch(() => { }); // Ignorer les erreurs si le navigateur bloque l'auto-play
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return diffMinutes < 1 ? "À l'instant" : `Il y a ${diffMinutes} min`;
        }
        return `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
        return 'Hier';
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
    } else {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

/**
 * Vérifier si un message est récent
 */
function isRecent(dateString, days) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < days;
}

/**
 * Échapper le HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
