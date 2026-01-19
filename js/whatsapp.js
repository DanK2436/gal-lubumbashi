<<<<<<< HEAD
/**
 * whatsapp.js - Intégration WhatsApp
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { t } from './i18n.js';

// Numéro WhatsApp par défaut GAL
const DEFAULT_PHONE = '+243979022998';

/**
 * Construit un lien WhatsApp
 * @param {string} phone - Numéro de téléphone au format international
 * @param {string} message - Message prérempli
 * @param {boolean} preferMobile - Préférer le lien mobile si sur mobile
 * @returns {string} URL WhatsApp
 */
export function buildWhatsAppLink(phone = DEFAULT_PHONE, message = '', preferMobile = true) {
    // Nettoyer le numéro de téléphone
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Encoder le message
    const encodedMessage = encodeURIComponent(message);

    // Détecter si on est sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Construire le lien
    if (isMobile && preferMobile) {
        return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    } else {
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }
}

/**
 * Ouvre WhatsApp dans une nouvelle fenêtre
 * @param {string} phone - Numéro de téléphone
 * @param {string} message - Message prérempli
 */
export function openWhatsApp(phone = DEFAULT_PHONE, message = '') {
    const link = buildWhatsAppLink(phone, message);
    window.open(link, '_blank', 'noopener,noreferrer');
}

/**
 * Génère un message pour une machine spécifique
 * @param {object} machine - Objet machine
 * @returns {string} Message formaté
 */
export function getMachineMessage(machine) {
    const defaultMessage = machine.defaultWhatsAppMessage ||
        t('whatsapp.machine_message', { name: machine.name });

    return defaultMessage;
}

/**
 * Génère un message pour une formation
 * @param {object} formation - Objet formation
 * @returns {string} Message formaté
 */
export function getFormationMessage(formation) {
    return t('whatsapp.formation_message', { title: formation.title });
}

/**
 * Message de contact général
 * @returns {string}
 */
export function getGeneralContactMessage() {
    return t('whatsapp.general_message');
}

/**
 * Initialise tous les boutons WhatsApp de la page
 */
export function initWhatsAppButtons() {
    // Boutons avec data-whatsapp
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = btn.dataset.whatsappPhone || DEFAULT_PHONE;
            const message = btn.dataset.whatsappMessage || getGeneralContactMessage();
            openWhatsApp(phone, message);
        });
    });

    // Boutons WhatsApp généraux
    document.querySelectorAll('.btn--whatsapp, .whatsapp-btn').forEach(btn => {
        if (!btn.dataset.whatsapp) {
            btn.addEventListener('click', (e) => {
                if (!btn.getAttribute('href')) {
                    e.preventDefault();
                    const message = btn.dataset.message || getGeneralContactMessage();
                    openWhatsApp(DEFAULT_PHONE, message);
                }
            });
        }
    });
}

/**
 * Crée un bouton WhatsApp flottant
 * @param {object} options - Options du bouton
 */
export function createFloatingWhatsAppButton(options = {}) {
    const {
        phone = DEFAULT_PHONE,
        message = getGeneralContactMessage(),
        position = 'bottom-left',
        text = t('whatsapp.contact_us')
    } = options;

    // Vérifier si le bouton existe déjà
    if (document.querySelector('.whatsapp-float')) {
        return;
    }

    const button = document.createElement('a');
    button.className = 'whatsapp-float';
    button.setAttribute('href', buildWhatsAppLink(phone, message));
    button.setAttribute('target', '_blank');
    button.setAttribute('rel', 'noopener noreferrer');
    button.setAttribute('aria-label', text);
    button.setAttribute('title', text);

    button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  `;

    // Styles inline pour le bouton
    const style = document.createElement('style');
    style.textContent = `
    .whatsapp-float {
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${position.includes('left') ? 'left: 20px;' : 'right: 20px;'}
      width: 60px;
      height: 60px;
      background: #25D366;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .whatsapp-float:hover {
      background: #128C7E;
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    .whatsapp-float svg {
      width: 32px;
      height: 32px;
    }
    
    @media (max-width: 768px) {
      .whatsapp-float {
        width: 50px;
        height: 50px;
        ${position.includes('bottom') ? 'bottom: 15px;' : 'top: 15px;'}
        ${position.includes('left') ? 'left: 15px;' : 'right: 15px;'}
      }
      
      .whatsapp-float svg {
        width: 28px;
        height: 28px;
      }
    }
  `;

    document.head.appendChild(style);
    document.body.appendChild(button);
}

export default {
    buildWhatsAppLink,
    openWhatsApp,
    getMachineMessage,
    getFormationMessage,
    getGeneralContactMessage,
    initWhatsAppButtons,
    createFloatingWhatsAppButton
};
=======
/**
 * whatsapp.js - Intégration WhatsApp
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { t } from './i18n.js';

// Numéro WhatsApp par défaut GAL
const DEFAULT_PHONE = '+243979022998';

/**
 * Construit un lien WhatsApp
 * @param {string} phone - Numéro de téléphone au format international
 * @param {string} message - Message prérempli
 * @param {boolean} preferMobile - Préférer le lien mobile si sur mobile
 * @returns {string} URL WhatsApp
 */
export function buildWhatsAppLink(phone = DEFAULT_PHONE, message = '', preferMobile = true) {
    // Nettoyer le numéro de téléphone
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Encoder le message
    const encodedMessage = encodeURIComponent(message);

    // Détecter si on est sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Construire le lien
    if (isMobile && preferMobile) {
        return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    } else {
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }
}

/**
 * Ouvre WhatsApp dans une nouvelle fenêtre
 * @param {string} phone - Numéro de téléphone
 * @param {string} message - Message prérempli
 */
export function openWhatsApp(phone = DEFAULT_PHONE, message = '') {
    const link = buildWhatsAppLink(phone, message);
    window.open(link, '_blank', 'noopener,noreferrer');
}

/**
 * Génère un message pour une machine spécifique
 * @param {object} machine - Objet machine
 * @returns {string} Message formaté
 */
export function getMachineMessage(machine) {
    const defaultMessage = machine.defaultWhatsAppMessage ||
        t('whatsapp.machine_message', { name: machine.name });

    return defaultMessage;
}

/**
 * Génère un message pour une formation
 * @param {object} formation - Objet formation
 * @returns {string} Message formaté
 */
export function getFormationMessage(formation) {
    return t('whatsapp.formation_message', { title: formation.title });
}

/**
 * Message de contact général
 * @returns {string}
 */
export function getGeneralContactMessage() {
    return t('whatsapp.general_message');
}

/**
 * Initialise tous les boutons WhatsApp de la page
 */
export function initWhatsAppButtons() {
    // Boutons avec data-whatsapp
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = btn.dataset.whatsappPhone || DEFAULT_PHONE;
            const message = btn.dataset.whatsappMessage || getGeneralContactMessage();
            openWhatsApp(phone, message);
        });
    });

    // Boutons WhatsApp généraux
    document.querySelectorAll('.btn--whatsapp, .whatsapp-btn').forEach(btn => {
        if (!btn.dataset.whatsapp) {
            btn.addEventListener('click', (e) => {
                if (!btn.getAttribute('href')) {
                    e.preventDefault();
                    const message = btn.dataset.message || getGeneralContactMessage();
                    openWhatsApp(DEFAULT_PHONE, message);
                }
            });
        }
    });
}

/**
 * Crée un bouton WhatsApp flottant
 * @param {object} options - Options du bouton
 */
export function createFloatingWhatsAppButton(options = {}) {
    const {
        phone = DEFAULT_PHONE,
        message = getGeneralContactMessage(),
        position = 'bottom-left',
        text = t('whatsapp.contact_us')
    } = options;

    // Vérifier si le bouton existe déjà
    if (document.querySelector('.whatsapp-float')) {
        return;
    }

    const button = document.createElement('a');
    button.className = 'whatsapp-float';
    button.setAttribute('href', buildWhatsAppLink(phone, message));
    button.setAttribute('target', '_blank');
    button.setAttribute('rel', 'noopener noreferrer');
    button.setAttribute('aria-label', text);
    button.setAttribute('title', text);

    button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  `;

    // Styles inline pour le bouton
    const style = document.createElement('style');
    style.textContent = `
    .whatsapp-float {
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${position.includes('left') ? 'left: 20px;' : 'right: 20px;'}
      width: 60px;
      height: 60px;
      background: #25D366;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .whatsapp-float:hover {
      background: #128C7E;
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    .whatsapp-float svg {
      width: 32px;
      height: 32px;
    }
    
    @media (max-width: 768px) {
      .whatsapp-float {
        width: 50px;
        height: 50px;
        ${position.includes('bottom') ? 'bottom: 15px;' : 'top: 15px;'}
        ${position.includes('left') ? 'left: 15px;' : 'right: 15px;'}
      }
      
      .whatsapp-float svg {
        width: 28px;
        height: 28px;
      }
    }
  `;

    document.head.appendChild(style);
    document.body.appendChild(button);
}

export default {
    buildWhatsAppLink,
    openWhatsApp,
    getMachineMessage,
    getFormationMessage,
    getGeneralContactMessage,
    initWhatsAppButtons,
    createFloatingWhatsAppButton
};
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
