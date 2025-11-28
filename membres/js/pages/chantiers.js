/**
 * chantiers.js - Gestion de la page chantiers
 */

import { isAuthenticated, getCurrentMember, logout } from '../auth.js';
import { showToast } from '../../../js/ui.js';

let allChantiers = [];

function initChantiers() {
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

    // Charger les chantiers
    loadChantiers();

    // Gérer la recherche
    document.getElementById('search-input').addEventListener('input', filterChantiers);
    document.getElementById('filter-status').addEventListener('change', filterChantiers);

    // Gérer le modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
    document.getElementById('modal-contact').addEventListener('click', contactForChantier);
}

function loadChantiers() {
    allChantiers = JSON.parse(localStorage.getItem('gal_chantiers') || '[]');
    displayChantiers(allChantiers);
}

function displayChantiers(chantiers) {
    const container = document.getElementById('chantiers-list');
    const emptyState = document.getElementById('empty-state');

    if (chantiers.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = chantiers.map(chantier => `
        <div class="chantier-card" data-id="${chantier.id}" onclick="window.showChantierDetails('${chantier.id}')">
            <div class="chantier-card__header">
                <h3 class="chantier-card__title">${chantier.title}</h3>
                <span class="badge badge--${getStatusClass(chantier.status)}">${chantier.status}</span>
            </div>
            <p class="chantier-card__description">${truncateText(chantier.description, 120)}</p>
            <div class="chantier-card__meta">
                <div class="chantier-card__meta-item">
                    <span>📍</span> ${chantier.location}
                </div>
                <div class="chantier-card__meta-item">
                    <span>📅</span> ${formatDate(chantier.date)}
                </div>
                ${chantier.budget ? `
                <div class="chantier-card__meta-item">
                    <span>💰</span> ${chantier.budget}
                </div>
                ` : ''}
                ${chantier.duration ? `
                <div class="chantier-card__meta-item">
                    <span>⏱️</span> ${chantier.duration}
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function filterChantiers() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;

    let filtered = allChantiers;

    // Filtre par recherche
    if (searchTerm) {
        filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(searchTerm) ||
            c.description.toLowerCase().includes(searchTerm) ||
            c.location.toLowerCase().includes(searchTerm)
        );
    }

    // Filtre par statut
    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }

    displayChantiers(filtered);
}

function showChantierDetails(id) {
    const chantier = allChantiers.find(c => c.id === id);
    if (!chantier) return;

    const modal = document.getElementById('chantier-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="detail-section">
            <h3>${chantier.title}</h3>
            <span class="badge badge--${getStatusClass(chantier.status)}">${chantier.status}</span>
        </div>
        
        <div class="detail-section">
            <h4>Description</h4>
            <p>${chantier.description}</p>
        </div>

        ${chantier.requirements ? `
        <div class="detail-section">
            <h4>Exigences</h4>
            <p>${chantier.requirements}</p>
        </div>
        ` : ''}

        <div class="detail-section">
            <h4>Informations</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>📍 Localisation</strong>
                    <span>${chantier.location}</span>
                </div>
                <div class="detail-item">
                    <strong>📅 Date de début</strong>
                    <span>${formatDate(chantier.date)}</span>
                </div>
                ${chantier.budget ? `
                <div class="detail-item">
                    <strong>💰 Budget</strong>
                    <span>${chantier.budget}</span>
                </div>
                ` : ''}
                ${chantier.duration ? `
                <div class="detail-item">
                    <strong>⏱️ Durée estimée</strong>
                    <span>${chantier.duration}</span>
                </div>
                ` : ''}
                ${chantier.contact ? `
                <div class="detail-item">
                    <strong>👤 Contact</strong>
                    <span>${chantier.contact}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'block';
    modal.dataset.chantierId = id;
}

function closeModal() {
    document.getElementById('chantier-modal').style.display = 'none';
}

function contactForChantier() {
    const chantierId = document.getElementById('chantier-modal').dataset.chantierId;
    const chantier = allChantiers.find(c => c.id === chantierId);

    if (chantier) {
        showToast('Votre candidature a été envoyée avec succès !', 'success');
        closeModal();

        // Dans un vrai système, envoyer une notification à l'admin
        // et enregistrer la candidature
    }
}

function getStatusClass(status) {
    const statusMap = {
        'actif': 'success',
        'en_attente': 'warning',
        'termine': 'muted'
    };
    return statusMap[status] || 'primary';
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

// Rendre la fonction accessible globalement pour l'onclick
window.showChantierDetails = showChantierDetails;

// Ajouter les styles supplémentaires
const styles = `
    <style>
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

        .badge--muted {
            background: #f3f4f6;
            color: #6b7280;
        }

        .badge--primary {
            background: var(--color-primary-light);
            color: var(--color-primary);
        }

        .detail-section {
            margin-bottom: 2rem;
        }

        .detail-section h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .detail-section h4 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--color-text);
        }

        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .detail-item strong {
            color: var(--color-text-muted);
            font-size: 0.875rem;
        }

        .detail-item span {
            font-size: 1rem;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', styles);

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChantiers);
} else {
    initChantiers();
}
