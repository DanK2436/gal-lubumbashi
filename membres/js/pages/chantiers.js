/**
 * chantiers.js - Gestion de la page chantiers
 */

import { isAuthenticated, getCurrentMember, logout } from '../auth.js';
import { showToast } from '../../../js/ui.js';
import { getProjects } from '../../../js/storage.js';

let allChantiers = [];

function initChantiers() {
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

    // Charger les chantiers
    loadChantiers();

    // Gérer la recherche
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', filterChantiers);

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) filterStatus.addEventListener('change', filterChantiers);

    // Gérer le modal
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    const modalCancelBtn = document.getElementById('modal-cancel');
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    const modalContactBtn = document.getElementById('modal-contact');
    if (modalContactBtn) modalContactBtn.addEventListener('click', contactForChantier);
}

function loadChantiers() {
    getProjects('chantiers').then(chantiers => {
        allChantiers = chantiers;
        displayChantiers(allChantiers);
    }).catch(console.error);
}

function displayChantiers(chantiers) {
    const container = document.getElementById('chantiers-list');
    const emptyState = document.getElementById('empty-state');

    if (!container || !emptyState) return;

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
                    <span>📅</span> ${formatDate(chantier.created_at || chantier.createdAt)}
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
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');

    if (!searchInput || !filterStatus) return;

    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;

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

    if (!modal || !modalBody) return;

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
                    <span>${formatDate(chantier.created_at || chantier.createdAt)}</span>
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
    const modal = document.getElementById('chantier-modal');
    if (modal) modal.style.display = 'none';
}

function contactForChantier() {
    const modal = document.getElementById('chantier-modal');
    if (!modal) return;

    const chantierId = modal.dataset.chantierId;
    const chantier = allChantiers.find(c => c.id === chantierId);

    if (chantier) {
        showToast('Votre candidature a été envoyée avec succès !', 'success');
        closeModal();
    }
}

function getStatusClass(status) {
    const statusMap = {
        'active': 'success',
        'pending': 'warning',
        'completed': 'muted',
        'actif': 'success',
        'en_attente': 'warning',
        'termine': 'muted'
    };
    return statusMap[status] || 'primary';
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

// Rendre la fonction accessible globalement pour l'onclick
window.showChantierDetails = showChantierDetails;

// Initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChantiers);
} else {
    initChantiers();
}
