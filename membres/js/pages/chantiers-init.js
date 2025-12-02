/**
 * chantiers-init.js - Initialisation de la page chantiers
 */

import { getProjects } from '../../../js/storage.js';

// Fonctions d'auth inline (pour éviter problèmes CORS file://)
function isAuthenticated() {
    return !!(localStorage.getItem('memberToken') || sessionStorage.getItem('memberToken'));
}

function getCurrentMember() {
    const data = localStorage.getItem('memberData');
    return data ? JSON.parse(data) : null;
}

function logout() {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    sessionStorage.removeItem('memberToken');
    window.location.href = '../login.html';
}

// Gestion de l'authentification
const member = getCurrentMember();
if (!member) {
    window.location.href = '../login.html';
} else {
    document.getElementById('member-name').textContent = member.name;
    document.getElementById('member-email').textContent = member.email;
    const initial = member.name.charAt(0).toUpperCase();
    document.getElementById('member-avatar').textContent = initial;
}

document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
});

// Chargement des chantiers
async function loadChantiers() {
    try {
        const chantiers = await getProjects('chantiers');
        const activeChantiers = chantiers.filter(c => c.status === 'active');
        renderChantiers(activeChantiers);
    } catch (error) {
        console.error('Erreur chargement chantiers:', error);
        const container = document.getElementById('chantiers-list');
        if (container) {
            container.innerHTML = '<div class="error-state">Erreur de chargement des chantiers</div>';
        }
    }
}

function renderChantiers(chantiers) {
    const container = document.getElementById('chantiers-list');
    if (!container) return;

    if (chantiers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state__icon">🏗️</span>
                <h3>Aucun chantier disponible</h3>
                <p>Les nouveaux chantiers apparaîtront ici</p>
            </div>
        `;
        return;
    }

    container.innerHTML = chantiers.map(chantier => `
        <div class="chantier-card">
            <img src="${chantier.image}" alt="${chantier.title}" class="chantier-img" onerror="this.src='https://via.placeholder.com/400x200'">
            <div class="chantier-content">
                <span class="badge badge--primary">Nouveau</span>
                <h3>${escapeHtml(chantier.title)}</h3>
                <p>${escapeHtml(chantier.description)}</p>
                <div class="chantier-footer">
                    <span class="date">Publié le ${new Date(chantier.created_at || chantier.createdAt).toLocaleDateString('fr-FR')}</span>
                    <button class="btn btn--sm btn--outline">Voir détails</button>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Styles additionnels
const style = document.createElement('style');
style.textContent = `
    .chantier-img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    .chantier-content h3 {
        margin: 0.5rem 0;
        color: var(--color-primary);
    }
    .chantier-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .badge--primary {
        background: rgba(220, 38, 38, 0.1);
        color: var(--color-primary);
    }
`;
document.head.appendChild(style);

// Lancer le chargement
document.addEventListener('DOMContentLoaded', loadChantiers);
