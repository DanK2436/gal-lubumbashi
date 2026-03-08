/**
 * annonces.js - Gestion de la page annonces
 */

import { isAuthenticated, getCurrentMember, logout } from '../auth.js';
import { getAnnouncements } from '../../../js/storage.js';

let allAnnonces = [];

function initAnnonces() {
    // Vérifier l'authentification IMMÉDIATEMENT au chargement
    if (!isAuthenticated()) {
        // Masquer le corps de la page avant la redirection pour éviter le clignotement
        document.body.style.display = 'none';
        window.location.replace('/membres/login.html');
        return;
    }

    // Charger les infos du membre
    const member = getCurrentMember();
    if (member) {
        document.getElementById('member-name').textContent = member.name;
    }

    // Gérer la déconnexion
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout();
        }
    });

    // Charger les annonces
    loadAnnonces();

    // Gérer le filtre
    document.getElementById('filter-priority').addEventListener('change', filterAnnonces);
}

function loadAnnonces() {
    getAnnouncements().then(annonces => {
        allAnnonces = annonces;
        // Trier par date (plus récent en premier)
        allAnnonces.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
        displayAnnonces(allAnnonces);
    }).catch(console.error);
}

function displayAnnonces(annonces) {
    const list = document.getElementById('annonces-list');
    const emptyState = document.getElementById('empty-state');

    if (!list || !emptyState) return;

    if (annonces.length === 0) {
        list.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    list.innerHTML = annonces.map(annonce => `
        <div class="annonce-card annonce-card--${annonce.priority}">
            <div class="annonce-card__header">
                <h3 class="annonce-card__title">${annonce.title || annonce.subject || ''}</h3>
                <span class="annonce-card__priority annonce-card__priority--${annonce.priority}">
                    ${getPriorityIcon(annonce.priority)} ${annonce.priority}
                </span>
            </div>
            <div class="annonce-card__message">${annonce.content || annonce.message || ''}</div>
            <div class="annonce-card__meta">
                <span>📅 ${formatDate(annonce.sent_at)}</span>
                ${annonce.author ? `<span>👤 ${annonce.author}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function filterAnnonces() {
    const priorityFilter = document.getElementById('filter-priority').value;

    let filtered = allAnnonces;

    // Filtre par priorité
    if (priorityFilter) {
        filtered = filtered.filter(a => a.priority === priorityFilter);
    }

    displayAnnonces(filtered);
}

function getPriorityIcon(priority) {
    const icons = {
        'haute': '🔴',
        'normale': '🔵',
        'basse': '⚪'
    };
    return icons[priority] || '🔵';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
}

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnnonces);
} else {
    initAnnonces();
}
