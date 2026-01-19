<<<<<<< HEAD
/**
 * dashboard.js - Gestion du tableau de bord membres
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { isAuthenticated, getCurrentMember, logout } from './auth.js';
import { getProjects, getAnnouncements, getMessagesByRecipient } from '../../js/storage.js';

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

    // Charger les statistiques et le contenu
    loadDashboardData();

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
 * Charger les données du tableau de bord
 */
async function loadDashboardData() {
    try {
        const member = getCurrentMember();

        // Charger les données en parallèle
        const [chantiers, conceptions, annonces, personalMessages, globalMessages] = await Promise.all([
            getProjects('chantiers'),
            getProjects('conceptions'),
            getAnnouncements(),
            member ? getMessagesByRecipient(member.id) : Promise.resolve([]),
            getMessagesByRecipient('all')
        ]);

        // Filtrer les actifs
        const activeChantiers = (chantiers || []).filter(c => c.status === 'active');
        const activeConceptions = (conceptions || []).filter(c => c.status === 'active');
        const allAnnonces = annonces || [];

        // Mettre à jour les stats
        updateStats(activeChantiers.length, activeConceptions.length, allAnnonces.length);

        // Mettre à jour le contenu récent
        loadRecentChantiers(activeChantiers);
        loadRecentAnnonces(allAnnonces);
        loadRecentConceptions(activeConceptions);

    } catch (error) {
        console.error('Erreur chargement dashboard:', error);
    }
}

/**
 * Mettre à jour les statistiques
 */
function updateStats(chantiersCount, conceptionsCount, annoncesCount) {
    const chantiersEl = document.getElementById('chantiers-count');
    const conceptionsEl = document.getElementById('conceptions-count');
    const annoncesEl = document.getElementById('annonces-count');

    if (chantiersEl) chantiersEl.textContent = chantiersCount;
    if (conceptionsEl) conceptionsEl.textContent = conceptionsCount;
    if (annoncesEl) annoncesEl.textContent = annoncesCount;
}

/**
 * Charger les derniers chantiers
 */
function loadRecentChantiers(chantiers) {
    const container = document.getElementById('recent-chantiers');
    if (!container) return;

    if (chantiers.length === 0) {
        container.innerHTML = '<div class="empty-state text-center py-8 text-muted">Aucun chantier récent</div>';
        return;
    }

    // Prendre les 3 derniers
    // Note: Supabase retourne déjà trié par date DESC normalement, sinon on trie
    chantiers.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
    const recent = chantiers.slice(0, 3);

    container.innerHTML = recent.map(chantier => `
        <div class="content-item">
            <div class="content-item__header">
                <h3 class="content-item__title">${escapeHtml(chantier.title)}</h3>
                <span class="badge badge--${chantier.status === 'active' ? 'success' : 'warning'}">${chantier.status}</span>
            </div>
            <p class="content-item__description">${escapeHtml(chantier.description)}</p>
            <div class="content-item__meta">
                <span>📅 ${formatDate(chantier.created_at || chantier.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Charger les dernières annonces
 */
function loadRecentAnnonces(annonces) {
    const container = document.getElementById('recent-annonces');
    if (!container) return;

    if (annonces.length === 0) {
        container.innerHTML = '<div class="empty-state text-center py-8 text-muted">Aucune annonce récente</div>';
        return;
    }

    // Prendre les 3 dernières
    annonces.sort((a, b) => new Date(b.sent_at || b.sentAt) - new Date(a.sent_at || a.sentAt));
    const recent = annonces.slice(0, 3);

    container.innerHTML = recent.map(annonce => `
        <div class="content-item">
            <div class="content-item__header">
                <h3 class="content-item__title">${escapeHtml(annonce.title || annonce.subject || '')}</h3>
                <span class="badge badge--primary">Annonce</span>
            </div>
            <p class="content-item__description">${escapeHtml(annonce.content || annonce.message || '')}</p>
            <div class="content-item__meta">
                <span>📅 ${formatDate(annonce.sent_at || annonce.sentAt)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Charger les dernières conceptions
 */
function loadRecentConceptions(conceptions) {
    const container = document.getElementById('recent-conceptions');
    if (!container) return;

    if (conceptions.length === 0) {
        container.innerHTML = '<div class="empty-state text-center py-8 text-muted">Aucune conception récente</div>';
        return;
    }

    // Prendre les 3 dernières
    conceptions.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
    const recent = conceptions.slice(0, 3);

    container.innerHTML = recent.map(conception => `
        <div class="card">
            <div class="card__image">
                <img src="${conception.image || '/public/images/placeholder.jpg'}" alt="${conception.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200'">
            </div>
            <div class="card__content">
                <h3 class="card__title">${escapeHtml(conception.title)}</h3>
                <p class="card__description">${escapeHtml(conception.description)}</p>
                <div class="card__meta">
                    <span>📐 Conception</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
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

// Styles pour les éléments de contenu
const styles = `
    <style>
        .content-item {
            padding: 1rem;
            border: 1px solid var(--color-border);
            border-radius: 0.5rem;
            transition: all 0.2s;
            margin-bottom: 1rem;
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
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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
=======
/**
 * dashboard.js - Gestion du tableau de bord membres
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { isAuthenticated, getCurrentMember, logout } from './auth.js';
import { getProjects, getAnnouncements, getMessagesByRecipient } from '../../js/storage.js';

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

    // Charger les statistiques et le contenu
    loadDashboardData();

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
 * Charger les données du tableau de bord
 */
async function loadDashboardData() {
    try {
        const member = getCurrentMember();

        // Charger les données en parallèle
        const [chantiers, conceptions, annonces, personalMessages, globalMessages] = await Promise.all([
            getProjects('chantiers'),
            getProjects('conceptions'),
            getAnnouncements(),
            member ? getMessagesByRecipient(member.id) : Promise.resolve([]),
            getMessagesByRecipient('all')
        ]);

        // Filtrer les actifs
        const activeChantiers = (chantiers || []).filter(c => c.status === 'active');
        const activeConceptions = (conceptions || []).filter(c => c.status === 'active');
        const allAnnonces = annonces || [];

        // Mettre à jour les stats
        updateStats(activeChantiers.length, activeConceptions.length, allAnnonces.length);

        // Mettre à jour le contenu récent
        loadRecentChantiers(activeChantiers);
        loadRecentAnnonces(allAnnonces);
        loadRecentConceptions(activeConceptions);

    } catch (error) {
        console.error('Erreur chargement dashboard:', error);
    }
}

/**
 * Mettre à jour les statistiques
 */
function updateStats(chantiersCount, conceptionsCount, annoncesCount) {
    const chantiersEl = document.getElementById('chantiers-count');
    const conceptionsEl = document.getElementById('conceptions-count');
    const annoncesEl = document.getElementById('annonces-count');

    if (chantiersEl) chantiersEl.textContent = chantiersCount;
    if (conceptionsEl) conceptionsEl.textContent = conceptionsCount;
    if (annoncesEl) annoncesEl.textContent = annoncesCount;
}

/**
 * Charger les derniers chantiers
 */
function loadRecentChantiers(chantiers) {
    const container = document.getElementById('recent-chantiers');
    if (!container) return;

    if (chantiers.length === 0) {
        container.innerHTML = '<div class="empty-state text-center py-8 text-muted">Aucun chantier récent</div>';
        return;
    }

    // Prendre les 3 derniers
    // Note: Supabase retourne déjà trié par date DESC normalement, sinon on trie
    chantiers.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
    const recent = chantiers.slice(0, 3);

    container.innerHTML = recent.map(chantier => `
        <div class="content-item">
            <div class="content-item__header">
                <h3 class="content-item__title">${escapeHtml(chantier.title)}</h3>
                <span class="badge badge--${chantier.status === 'active' ? 'success' : 'warning'}">${chantier.status}</span>
            </div>
            <p class="content-item__description">${escapeHtml(chantier.description)}</p>
            <div class="content-item__meta">
                <span>📅 ${formatDate(chantier.created_at || chantier.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Charger les dernières annonces
 */
function loadRecentAnnonces(annonces) {
    const container = document.getElementById('recent-annonces');
    if (!container) return;

    if (annonces.length === 0) {
        container.innerHTML = '<div class="empty-state text-center py-8 text-muted">Aucune annonce récente</div>';
        return;
    }

    // Prendre les 3 dernières
    annonces.sort((a, b) => new Date(b.sent_at || b.sentAt) - new Date(a.sent_at || a.sentAt));
    const recent = annonces.slice(0, 3);

    container.innerHTML = recent.map(annonce => `
        <div class="content-item">
            <div class="content-item__header">
                <h3 class="content-item__title">${escapeHtml(annonce.title || annonce.subject || '')}</h3>
                <span class="badge badge--primary">Annonce</span>
            </div>
            <p class="content-item__description">${escapeHtml(annonce.content || annonce.message || '')}</p>
            <div class="content-item__meta">
                <span>📅 ${formatDate(annonce.sent_at || annonce.sentAt)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Charger les dernières conceptions
 */
function loadRecentConceptions(conceptions) {
    const container = document.getElementById('recent-conceptions');
    if (!container) return;

    if (conceptions.length === 0) {
        container.innerHTML = '<div class="empty-state text-center py-8 text-muted">Aucune conception récente</div>';
        return;
    }

    // Prendre les 3 dernières
    conceptions.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
    const recent = conceptions.slice(0, 3);

    container.innerHTML = recent.map(conception => `
        <div class="card">
            <div class="card__image">
                <img src="${conception.image || '/public/images/placeholder.jpg'}" alt="${conception.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200'">
            </div>
            <div class="card__content">
                <h3 class="card__title">${escapeHtml(conception.title)}</h3>
                <p class="card__description">${escapeHtml(conception.description)}</p>
                <div class="card__meta">
                    <span>📐 Conception</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
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

// Styles pour les éléments de contenu
const styles = `
    <style>
        .content-item {
            padding: 1rem;
            border: 1px solid var(--color-border);
            border-radius: 0.5rem;
            transition: all 0.2s;
            margin-bottom: 1rem;
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
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
