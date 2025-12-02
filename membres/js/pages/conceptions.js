/**
 * conceptions.js - Gestion de la page conceptions
 */

import { isAuthenticated, getCurrentMember, logout } from '../auth.js';
import { getProjects } from '../../../js/storage.js';

let allConceptions = [];

function initConceptions() {
    // Vérifier l'authentification IMMÉDIATEMENT au chargement
    if (!isAuthenticated()) {
        // Masquer le corps de la page avant la redirection pour éviter le clignotement
        document.body.style.display = 'none';
        window.location.replace('/membres/index.html');
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

    // Charger les conceptions
    loadConceptions();

    // Gérer la recherche et les filtres
    document.getElementById('search-input').addEventListener('input', filterConceptions);
    document.getElementById('filter-category').addEventListener('change', filterConceptions);
}

function loadConceptions() {
    getProjects('conception').then(conceptions => {
        allConceptions = conceptions;
        displayConceptions(allConceptions);
    }).catch(console.error);
}

function displayConceptions(conceptions) {
    const grid = document.getElementById('conceptions-grid');
    const emptyState = document.getElementById('empty-state');

    if (conceptions.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    grid.innerHTML = conceptions.map(conception => `
        <div class="conception-card">
            <div class="conception-card__image">
                ${conception.image ?
            `<img src="${conception.image}" alt="${conception.title}" loading="lazy">` :
            `<span>📐</span>`
        }
            </div>
            <div class="conception-card__content">
                <h3 class="conception-card__title">${conception.title}</h3>
                <p class="conception-card__description">${truncateText(conception.description, 100)}</p>
                <div class="conception-card__meta">
                    <span class="conception-card__category">📁 ${conception.category || 'Général'}</span>
                    <span class="conception-card__date">${formatDate(conception.created_at)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterConceptions() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;

    let filtered = allConceptions;

    // Filtre par recherche
    if (searchTerm) {
        filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(searchTerm) ||
            c.description.toLowerCase().includes(searchTerm)
        );
    }

    // Filtre par catégorie
    if (categoryFilter) {
        filtered = filtered.filter(c => c.category === categoryFilter);
    }

    displayConceptions(filtered);
}

function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConceptions);
} else {
    initConceptions();
}
