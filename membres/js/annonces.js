<<<<<<< HEAD
/**
 * annonces.js - Affichage des annonces dans l'espace membre
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { getCurrentMember } from './auth.js';
import { showToast } from '../../js/ui.js';
import { getAnnouncements } from '../../js/storage.js';

/**
 * Charger et afficher les annonces
 */
export function init() {
    loadAnnonces();
    checkForNewAnnouncements();
}

/**
 * Charger les annonces depuis Supabase
 */
async function loadAnnonces() {
    try {
        const annonces = await getAnnouncements();
        renderAnnonces(annonces);
    } catch (error) {
        console.error('Erreur chargement annonces:', error);
        const container = document.getElementById('annonces-list');
        if (container) {
            container.innerHTML = '<div class="error-state">Erreur de chargement des annonces</div>';
        }
    }
}

function renderAnnonces(annonces) {
    const container = document.getElementById('annonces-list');

    if (!container) return;

    if (!annonces || annonces.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state__icon">📢</span>
                <h3>Aucune annonce</h3>
                <p>Les annonces de l'administration apparaîtront ici</p>
            </div>
        `;
        return;
    }

    // Trier par date (plus récent en premier)
    annonces.sort((a, b) => new Date(b.sent_at || b.sentAt) - new Date(a.sent_at || a.sentAt));

    container.innerHTML = annonces.map(annonce => createAnnonceCard(annonce)).join('');
}

/**
 * Créer une carte d'annonce
 */
function createAnnonceCard(annonce) {
    const sentAt = annonce.sent_at || annonce.sentAt;
    const date = formatDate(sentAt);
    const isNew = isRecent(sentAt, 7);

    return `
        <div class="annonce-card ${isNew ? 'annonce-card--new' : ''}" data-annonce-id="${annonce.id}">
            <div class="annonce-header">
                <div class="annonce-meta">
                    <span class="annonce-icon">📢</span>
                    ${isNew ? '<span class="badge badge--warning">Nouveau</span>' : ''}
                    <span class="annonce-date">${date}</span>
                </div>
            </div>
            <div class="annonce-body">
                <h3 class="annonce-title">${escapeHtml(annonce.title || annonce.subject)}</h3>
                <p class="annonce-message">${escapeHtml(annonce.content || annonce.message).replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    `;
}

/**
 * Vérifier les nouvelles annonces et afficher notification
 */
async function checkForNewAnnouncements() {
    const currentMember = getCurrentMember();
    if (!currentMember) return;

    const lastCheck = localStorage.getItem(`lastAnnouncementCheck_${currentMember.id}`);
    const now = new Date().getTime();

    if (lastCheck) {
        try {
            const annonces = await getAnnouncements();
            const newAnnonces = annonces.filter(annonce =>
                new Date(annonce.sent_at || annonce.sentAt).getTime() > parseInt(lastCheck)
            );

            if (newAnnonces.length > 0) {
                playNotificationSound();
                showToast(`${newAnnonces.length} nouvelle(s) annonce(s)`, 'info');
            }
        } catch (error) {
            console.error('Erreur vérification nouvelles annonces:', error);
        }
    }

    localStorage.setItem(`lastAnnouncementCheck_${currentMember.id}`, now.toString());
}

/**
 * Jouer le son de notification
 */
function playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSWAy/DdkEAKFF604OyhVBQKRp/g8r5sIQUlgMvw3ZBACV==');
    audio.play().catch(() => { });
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Aujourd'hui";
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
 * Vérifier si une annonce est récente
 */
function isRecent(dateString, days) {
    if (!dateString) return false;
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
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
=======
/**
 * annonces.js - Affichage des annonces dans l'espace membre
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { getCurrentMember } from './auth.js';
import { showToast } from '../../js/ui.js';
import { getAnnouncements } from '../../js/storage.js';

/**
 * Charger et afficher les annonces
 */
export function init() {
    loadAnnonces();
    checkForNewAnnouncements();
}

/**
 * Charger les annonces depuis Supabase
 */
async function loadAnnonces() {
    try {
        const annonces = await getAnnouncements();
        renderAnnonces(annonces);
    } catch (error) {
        console.error('Erreur chargement annonces:', error);
        const container = document.getElementById('annonces-list');
        if (container) {
            container.innerHTML = '<div class="error-state">Erreur de chargement des annonces</div>';
        }
    }
}

function renderAnnonces(annonces) {
    const container = document.getElementById('annonces-list');

    if (!container) return;

    if (!annonces || annonces.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state__icon">📢</span>
                <h3>Aucune annonce</h3>
                <p>Les annonces de l'administration apparaîtront ici</p>
            </div>
        `;
        return;
    }

    // Trier par date (plus récent en premier)
    annonces.sort((a, b) => new Date(b.sent_at || b.sentAt) - new Date(a.sent_at || a.sentAt));

    container.innerHTML = annonces.map(annonce => createAnnonceCard(annonce)).join('');
}

/**
 * Créer une carte d'annonce
 */
function createAnnonceCard(annonce) {
    const sentAt = annonce.sent_at || annonce.sentAt;
    const date = formatDate(sentAt);
    const isNew = isRecent(sentAt, 7);

    return `
        <div class="annonce-card ${isNew ? 'annonce-card--new' : ''}" data-annonce-id="${annonce.id}">
            <div class="annonce-header">
                <div class="annonce-meta">
                    <span class="annonce-icon">📢</span>
                    ${isNew ? '<span class="badge badge--warning">Nouveau</span>' : ''}
                    <span class="annonce-date">${date}</span>
                </div>
            </div>
            <div class="annonce-body">
                <h3 class="annonce-title">${escapeHtml(annonce.title || annonce.subject)}</h3>
                <p class="annonce-message">${escapeHtml(annonce.content || annonce.message).replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    `;
}

/**
 * Vérifier les nouvelles annonces et afficher notification
 */
async function checkForNewAnnouncements() {
    const currentMember = getCurrentMember();
    if (!currentMember) return;

    const lastCheck = localStorage.getItem(`lastAnnouncementCheck_${currentMember.id}`);
    const now = new Date().getTime();

    if (lastCheck) {
        try {
            const annonces = await getAnnouncements();
            const newAnnonces = annonces.filter(annonce =>
                new Date(annonce.sent_at || annonce.sentAt).getTime() > parseInt(lastCheck)
            );

            if (newAnnonces.length > 0) {
                playNotificationSound();
                showToast(`${newAnnonces.length} nouvelle(s) annonce(s)`, 'info');
            }
        } catch (error) {
            console.error('Erreur vérification nouvelles annonces:', error);
        }
    }

    localStorage.setItem(`lastAnnouncementCheck_${currentMember.id}`, now.toString());
}

/**
 * Jouer le son de notification
 */
function playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSWAy/DdkEAKFF604OyhVBQKRp/g8r5sIQUlgMvw3ZBACV==');
    audio.play().catch(() => { });
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Aujourd'hui";
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
 * Vérifier si une annonce est récente
 */
function isRecent(dateString, days) {
    if (!dateString) return false;
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
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
