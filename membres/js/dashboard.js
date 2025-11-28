/**
 * dashboard.js - Gestion du tableau de bord membres
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { isAuthenticated, getCurrentMember, logout } from './auth.js';

/**
 * Initialiser le tableau de bord
 */
function initDashboard() {
    // Vérifier l'authentification IMMÉDIATEMENT au chargement
    if (!isAuthenticated()) {
        // Masquer le corps de la page avant la redirection pour éviter le clignotement
        document.body.style.display = 'none';
        window.location.replace('/membres/index.html');
        return;
    }

    // Charger les informations du membre
    loadMemberInfo();

    // Charger les statistiques
    loadStats();

    // Charger le contenu récent
    loadRecentContent();

    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                logout();
            }
        });
    }
}

/**
 * Charger les informations du membre
 */
function loadMemberInfo() {
    const member = getCurrentMember();
    if (member) {
        // Afficher le nom
        const memberNameEl = document.getElementById('member-name');
        if (memberNameEl) {
            memberNameEl.textContent = member.name;
        }

        // Afficher l'email
        const memberEmailEl = document.getElementById('member-email');
        if (memberEmailEl) {
            memberEmailEl.textContent = member.email;
        }

        // Afficher le prénom dans le message de bienvenue
        const welcomeNameEl = document.getElementById('welcome-name');
        if (welcomeNameEl) {
            welcomeNameEl.textContent = member.name.split(' ')[0];
        }

        // Afficher l'initiale dans l'avatar
        const avatarEl = document.getElementById('member-avatar');
        if (avatarEl) {
            avatarEl.textContent = member.name.charAt(0).toUpperCase();
        }
    }
}

/**
 * Charger les statistiques
 */
function loadStats() {
    const chantiers = JSON.parse(localStorage.getItem('gal_chantiers') || '[]');
    const conceptions = JSON.parse(localStorage.getItem('gal_conceptions') || '[]');
    const annonces = JSON.parse(localStorage.getItem('gal_annonces') || '[]');

    document.getElementById('chantiers-count').textContent = chantiers.length;
    document.getElementById('conceptions-count').textContent = conceptions.length;
    document.getElementById('annonces-count').textContent = annonces.length;
}

/**
 * Charger le contenu récent
 */
function loadRecentContent() {
    loadRecentChantiers();
    loadRecentAnnonces();
    loadRecentConceptions();
}

/**
 * Charger les derniers chantiers
 */
function loadRecentChantiers() {
    const chantiers = JSON.parse(localStorage.getItem('gal_chantiers') || '[]');
    const container = document.getElementById('recent-chantiers');

    if (chantiers.length === 0) {
        return;
    }

    // Prendre les 3 derniers
    const recent = chantiers.slice(-3).reverse();

    container.innerHTML = recent.map(chantier => `
        <div class="content-item">
            <div class="content-item__header">
                <h3 class="content-item__title">${chantier.title}</h3>
                <span class="badge badge--${chantier.status === 'actif' ? 'success' : 'warning'}">${chantier.status}</span>
            </div>
            <p class="content-item__description">${chantier.description}</p>
            <div class="content-item__meta">
                <span>📍 ${chantier.location}</span>
                <span>📅 ${formatDate(chantier.date)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Charger les dernières annonces
 */
function loadRecentAnnonces() {
    const annonces = JSON.parse(localStorage.getItem('gal_annonces') || '[]');
    const container = document.getElementById('recent-annonces');

    if (annonces.length === 0) {
        return;
    }

    // Prendre les 3 dernières
    const recent = annonces.slice(-3).reverse();

    container.innerHTML = recent.map(annonce => `
        <div class="content-item">
            <div class="content-item__header">
                <h3 class="content-item__title">${annonce.title}</h3>
                <span class="badge badge--${annonce.priority === 'haute' ? 'error' : 'primary'}">${annonce.priority}</span>
            </div>
            <p class="content-item__description">${annonce.message}</p>
            <div class="content-item__meta">
                <span>📅 ${formatDate(annonce.date)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Charger les dernières conceptions
 */
function loadRecentConceptions() {
    const conceptions = JSON.parse(localStorage.getItem('gal_conceptions') || '[]');
    const container = document.getElementById('recent-conceptions');

    if (conceptions.length === 0) {
        return;
    }

    // Prendre les 3 dernières
    const recent = conceptions.slice(-3).reverse();

    container.innerHTML = recent.map(conception => `
        <div class="card">
            <div class="card__image">
                <img src="${conception.image || '/public/images/placeholder.jpg'}" alt="${conception.title}" loading="lazy">
            </div>
            <div class="card__content">
                <h3 class="card__title">${conception.title}</h3>
                <p class="card__description">${conception.description}</p>
                <div class="card__meta">
                    <span>📐 ${conception.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

// Styles pour les éléments de contenu
const styles = `
    <style>
        .content-item {
            padding: 1rem;
            border: 1px solid var(--color-border);
            border-radius: 0.5rem;
            transition: all 0.2s;
        }

        .content-item:hover {
            border-color: var(--color-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .content-item__header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 0.75rem;
        }

        .content-item__title {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 0;
        }

        .content-item__description {
            color: var(--color-text-muted);
            margin-bottom: 0.75rem;
            line-height: 1.5;
        }

        .content-item__meta {
            display: flex;
            gap: 1rem;
            font-size: 0.875rem;
            color: var(--color-text-muted);
        }

        .badge {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge--success {
            background: #d1fae5;
            color: #065f46;
        }

        .badge--warning {
            background: #fef3c7;
            color: #92400e;
        }

        .badge--error {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge--primary {
            background: var(--color-primary-light);
            color: var(--color-primary);
        }

        .card__meta {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid var(--color-border);
            font-size: 0.875rem;
            color: var(--color-text-muted);
        }
    </style>
`;

// Ajouter les styles au document
document.head.insertAdjacentHTML('beforeend', styles);

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
