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
        window.location.replace('/membres/login.html');
        return;
    }

    // Charger les infos du membre
    const member = getCurrentMember();
    if (member) {
        const memberNameEl = document.getElementById('member-name');
        if (memberNameEl) memberNameEl.textContent = member.name;
    }

    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                logout();
            }
        });
    }

    // Charger les conceptions
    loadConceptions();

    // Gérer la recherche et les filtres
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', filterConceptions);
    
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) filterCategory.addEventListener('change', filterConceptions);
}

function loadConceptions() {
    getProjects('conceptions').then(conceptions => {
        allConceptions = conceptions;
        displayConceptions(allConceptions);
    }).catch(console.error);
}

function displayConceptions(conceptions) {
    const grid = document.getElementById('conceptions-grid');
    const emptyState = document.getElementById('empty-state');

    if (!grid || !emptyState) return;

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
                    <span class="conception-card__date">${formatDate(conception.created_at || conception.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterConceptions() {
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    
    if (!searchInput || !filterCategory) return;

    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterCategory.value;

    let filtered = allConceptions;

    // Filtre par recherche
    if (searchTerm) {
        filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(searchTerm) ||
            (c.description && c.description.toLowerCase().includes(searchTerm))
        );
    }

    // Filtre par catégorie
    if (categoryFilter) {
        filtered = filtered.filter(c => c.category === categoryFilter);
    }

    displayConceptions(filtered);
}

function truncateText(text, length) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function formatDate(dateString) {
    if (!dateString) return 'Date inconnue';
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
