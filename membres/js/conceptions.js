/**
 * conceptions.js - Affichage des conceptions pour les membres
 */

import { getProjects } from '../../js/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    loadConceptions();
});

async function loadConceptions() {
    try {
        const conceptions = await getProjects('conceptions');
        const activeConceptions = conceptions.filter(c => c.status === 'active');
        renderConceptions(activeConceptions);
    } catch (error) {
        console.error('Erreur chargement conceptions:', error);
        const container = document.getElementById('conceptions-list');
        if (container) {
            container.innerHTML = '<div class="error-state">Erreur de chargement des conceptions</div>';
        }
    }
}

function renderConceptions(conceptions) {

    const container = document.getElementById('conceptions-list');
    if (!container) return;

    if (conceptions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state__icon">📐</span>
                <h3>Aucune conception disponible</h3>
                <p>Vos conceptions apparaîtront ici</p>
            </div>
        `;
        return;
    }

    container.innerHTML = conceptions.map(conception => `
        <div class="chantier-card">
            <img src="${conception.image}" alt="${conception.title}" class="chantier-img" onerror="this.src='https://via.placeholder.com/400x200'">
            <div class="chantier-content">
                <span class="badge badge--info">Conception</span>
                <h3>${escapeHtml(conception.title)}</h3>
                <p>${escapeHtml(conception.description)}</p>
                <div class="chantier-footer">
                    <span class="date">Publié le ${new Date(conception.created_at || conception.createdAt).toLocaleDateString('fr-FR')}</span>
                    <button class="btn btn--sm btn--outline">Télécharger</button>
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

// Réutilisation des styles de chantiers car la structure est similaire
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
    .badge--info {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
    }
`;
document.head.appendChild(style);
