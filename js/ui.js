/**
 * ui.js - Composants UI réutilisables
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { t } from './i18n.js';

// ===== CARDS =====

/**
 * Crée une carte
 * @param {object} options - Options de la carte
 * @returns {HTMLElement}
 */
export function createCard(options = {}) {
    const {
        title,
        image,
        description,
        badge,
        meta,
        actions = [],
        className = ''
    } = options;

    const card = document.createElement('div');
    card.className = `card ${className}`;

    let html = '';

    // Image
    if (image) {
        html += `
      <div class="card__image-container">
        <img src="${image}" alt="${title}" class="card__image" loading="lazy">
        ${badge ? `<div class="card__badge">${badge}</div>` : ''}
      </div>
    `;
    }

    // Contenu
    html += '<div class="card__content">';

    if (title) {
        html += `<h3 class="card__title">${title}</h3>`;
    }

    if (description) {
        html += `<p class="card__description">${description}</p>`;
    }

    // Footer
    if (meta || actions.length > 0) {
        html += '<div class="card__footer">';

        if (meta) {
            html += `<div class="card__meta">${meta}</div>`;
        }

        if (actions.length > 0) {
            actions.forEach(action => {
                html += action;
            });
        }

        html += '</div>';
    }

    html += '</div>';

    card.innerHTML = html;
    return card;
}

/**
 * Crée une carte vidéo
 * @param {object} video - Données vidéo
 * @returns {HTMLElement}
 */
export function createVideoCard(video) {
    const duration = formatDuration(video.durationSeconds);
    const isShort = video.durationSeconds <= 120;

    const badge = isShort
        ? `<span class="badge badge--primary">≤ 2 min</span>`
        : '';

    return createCard({
        title: sanitizeHTML(video.title),
        image: video.thumbnail,
        description: sanitizeHTML(video.category),
        badge,
        meta: `<span>⏱️ ${duration}</span>`,
        actions: [
            `<button class="btn btn--primary btn--sm" data-video-id="${video.id}">
        ${t('actions.watch')} ▶
      </button>`
        ],
        className: 'video-card'
    });
}

/**
 * Crée une carte machine
 * @param {object} machine - Données machine
 * @returns {HTMLElement}
 */
export function createMachineCard(machine) {
    const statusClass = machine.status === 'Disponible' ? 'success' : 'warning';
    const badge = `<span class="badge badge--${statusClass}">${machine.status}</span>`;

    const specs = machine.specs && machine.specs.length > 0
        ? machine.specs.slice(0, 3).map(s => `<li>${s.label}: ${s.value}</li>`).join('')
        : '';

    const specsHtml = specs ? `<ul class="list-none ml-0 text-sm mb-2">${specs}</ul>` : '';
    const descHtml = machine.description ? `<p class="card__description text-sm mb-2">${sanitizeHTML(machine.description)}</p>` : '';

    return createCard({
        title: sanitizeHTML(machine.name),
        image: machine.image,
        description: descHtml + specsHtml,
        badge,
        meta: machine.priceRange ? `<span class="text-primary font-semibold">${sanitizeHTML(machine.priceRange)}</span>` : '',
        actions: [
            `<button class="btn btn--whatsapp btn--sm" data-whatsapp data-whatsapp-message="${getMachineWhatsAppMessage(machine)}">
        ${t('machines.interested')}
      </button>`
        ],
        className: 'machine-card'
    });
}

/**
 * Crée une carte formation
 * @param {object} formation - Données formation
 * @returns {HTMLElement}
 */
export function createFormationCard(formation) {
    const duration = formatDuration(formation.lengthSeconds);

    return createCard({
        title: sanitizeHTML(formation.title),
        image: formation.preview,
        description: sanitizeHTML(formation.description),
        badge: `<span class="badge badge--primary">${sanitizeHTML(formation.theme)}</span>`,
        meta: `<span>📚 ${duration}</span>`,
        actions: [
            `<button class="btn btn--primary btn--sm" data-formation-id="${formation.id}">
        ${t('formations.start')}
      </button>`
        ],
        className: 'formation-card'
    });
}

/**
 * Crée une carte blog
 * @param {object} post - Article de blog
 * @returns {HTMLElement}
 */
export function createBlogCard(post) {
    const date = new Date(post.date).toLocaleDateString('fr-FR');
    const tags = post.tags && post.tags.length > 0
        ? post.tags.slice(0, 2).map(tag => `<span class="badge badge--secondary">${tag}</span>`).join(' ')
        : '';

    return createCard({
        title: sanitizeHTML(post.title),
        image: post.cover,
        description: sanitizeHTML(post.excerpt),
        meta: `<span class="text-muted text-sm">${date}</span>`,
        actions: [
            tags,
            `<a href="#/blog/${post.slug}" class="btn btn--ghost btn--sm">
        ${t('actions.read_more')}
      </a>`
        ],
        className: 'blog-card'
    });
}

// ===== MODAL =====

let activeModal = null;

/**
 * Ouvre une modal
 * @param {string|HTMLElement} content - Contenu de la modal
 * @param {object} options - Options
 */
export function openModal(content, options = {}) {
    const {
        title = '',
        size = 'md',
        closeOnBackdrop = true
    } = options;

    // Fermer la modal active s'il y en a une
    if (activeModal) {
        closeModal();
    }

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (title) modal.setAttribute('aria-label', title);

    modal.innerHTML = `
    <div class="modal__backdrop"></div>
    <div class="modal__content modal__content--${size}">
      ${title ? `
        <div class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="modal__close" aria-label="${t('actions.close')}">×</button>
        </div>
      ` : `<button class="modal__close" aria-label="${t('actions.close')}">×</button>`}
      <div class="modal__body">
        ${typeof content === 'string' ? content : ''}
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    // Si le contenu est un élément, l'ajouter
    if (content instanceof HTMLElement) {
        modal.querySelector('.modal__body').appendChild(content);
    }

    // Gestion des événements
    const closeBtn = modal.querySelector('.modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');

    closeBtn.addEventListener('click', closeModal);

    if (closeOnBackdrop) {
        backdrop.addEventListener('click', closeModal);
    }

    // Fermer avec Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Focus trap
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTab = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    modal.addEventListener('keydown', handleTab);

    activeModal = modal;
    activeModal._cleanup = () => {
        document.removeEventListener('keydown', handleEscape);
    };

    document.body.style.overflow = 'hidden';
}

/**
 * Ferme la modal active
 */
export function closeModal() {
    if (activeModal) {
        activeModal._cleanup?.();
        activeModal.remove();
        activeModal = null;
        document.body.style.overflow = '';
    }
}

// ===== ACCORDION =====

/**
 * Initialise les accordéons
 * @param {string} selector - Sélecteur CSS
 */
export function initAccordion(selector = '.accordion') {
    document.querySelectorAll(selector).forEach(accordion => {
        accordion.querySelectorAll('.accordion__header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion__item');
                const isActive = item.classList.contains('active');

                // Fermer tous les autres items (optionnel)
                accordion.querySelectorAll('.accordion__item').forEach(i => {
                    if (i !== item) i.classList.remove('active');
                });

                // Toggle l'item courant
                item.classList.toggle('active', !isActive);
            });
        });
    });
}

// ===== TOAST =====

const toastContainer = (() => {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
    return container;
})();

/**
 * Affiche un toast
 * @param {string} message - Message
 * @param {string} type - Type (success, error, warning, info)
 * @param {number} duration - Durée en ms
 */
export function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${message}</span>
    <button class="toast__close" aria-label="${t('actions.close')}">×</button>
  `;

    toastContainer.appendChild(toast);

    // Fermeture
    const close = () => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast__close').addEventListener('click', close);

    if (duration > 0) {
        setTimeout(close, duration);
    }
}

// ===== VIDEO PLAYER =====

/**
 * Crée un lecteur vidéo
 * @param {object} video - Données vidéo
 * @returns {HTMLElement}
 */
export function createVideoPlayer(video) {
    const player = document.createElement('div');
    player.className = 'video-player';

    player.innerHTML = `
    <video class="video-player__video" controls>
      <source src="${video.url}" type="video/mp4">
      ${t('video.not_supported')}
    </video>
    ${video.durationSeconds ? `
      <div class="video-player__duration">${formatDuration(video.durationSeconds)}</div>
    ` : ''}
  `;

    return player;
}

// ===== GRID =====

/**
 * Crée une grille de cartes
 * @param {Array} items - Items à afficher
 * @param {Function} cardCreator - Fonction de création de carte
 * @param {number} columns - Nombre de colonnes
 * @returns {HTMLElement}
 */
export function createGrid(items, cardCreator, columns = 3) {
    const grid = document.createElement('div');
    grid.className = `grid grid--${columns}`;

    items.forEach(item => {
        const card = cardCreator(item);
        grid.appendChild(card);
    });

    return grid;
}

// ===== PAGINATION =====

/**
 * Crée une pagination
 * @param {object} options - Options
 * @returns {HTMLElement}
 */
export function createPagination(options = {}) {
    const {
        currentPage = 1,
        totalPages = 1,
        onPageChange = () => { }
    } = options;

    const pagination = document.createElement('div');
    pagination.className = 'pagination d-flex justify-center align-center gap-2 mt-8';

    const createButton = (page, label = page, disabled = false) => {
        const btn = document.createElement('button');
        btn.className = `btn btn--sm ${page === currentPage ? 'btn--primary' : 'btn--ghost'}`;
        btn.textContent = label;
        btn.disabled = disabled;

        if (!disabled) {
            btn.addEventListener('click', () => onPageChange(page));
        }

        return btn;
    };

    // Bouton précédent
    pagination.appendChild(createButton(currentPage - 1, '← ' + t('prev'), currentPage === 1));

    // Pages
    for (let i = 1; i <= totalPages; i++) {
        // Afficher les 3 premières, les 3 dernières, et 2 autour de la page actuelle
        if (
            i <= 3 ||
            i > totalPages - 3 ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pagination.appendChild(createButton(i));
        } else if (
            i === 4 && currentPage > 5 ||
            i === totalPages - 3 && currentPage < totalPages - 4
        ) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'text-muted';
            pagination.appendChild(ellipsis);
        }
    }

    // Bouton suivant
    pagination.appendChild(createButton(currentPage + 1, t('next') + ' →', currentPage === totalPages));

    return pagination;
}

// ===== HELPERS =====

/**
 * Formate une durée en secondes
 * @param {number} seconds - Secondes
 * @returns {string}
 */
export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    }
    return `${minutes}min ${secs}s`;
}

/**
 * Génère un message WhatsApp pour une machine
 * @param {object} machine
 * @returns {string}
 */
function getMachineWhatsAppMessage(machine) {
    return machine.defaultWhatsAppMessage ||
        `Bonjour, je suis intéressé(e) par la machine: ${machine.name}. Pouvez-vous m'en dire plus ?`;
}

/**
 * Sanitize HTML pour éviter XSS
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

export default {
    createCard,
    createVideoCard,
    createMachineCard,
    createFormationCard,
    createBlogCard,
    openModal,
    closeModal,
    initAccordion,
    showToast,
    createVideoPlayer,
    createGrid,
    createPagination,
    formatDuration,
    sanitizeHTML
};
