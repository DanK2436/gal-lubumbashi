/**
 * member-common.js - Script commun pour toutes les pages membres
 * Gère l'authentification, l'affichage du profil et les notifications
 */

import { getCurrentMember, logout, isAuthenticated } from './auth.js';
import { initNotificationsUI } from '../../js/notifications-ui.js';

export async function initMemberPage() {
    // 1. Vérifer l'authentification
    if (!isAuthenticated()) {
        window.location.href = '../login.html';
        return null;
    }

    const member = getCurrentMember();
    if (!member) {
        window.location.href = '../login.html';
        return null;
    }

    // 2. Mettre à jour les informations du profil dans le header
    updateHeaderProfile(member);

    // 3. Initialiser les notifications
    await initNotificationsUI();

    // 4. Gérer la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                logout();
            }
        };
    }

    // 5. Menu Mobile
    initMobileMenu();

    return member;
}

function updateHeaderProfile(member) {
    const nameEl = document.getElementById('member-name');
    const emailEl = document.getElementById('member-email');
    const avatarEl = document.getElementById('member-avatar');

    if (nameEl) nameEl.textContent = member.name;
    if (emailEl) emailEl.textContent = member.email;
    if (avatarEl) avatarEl.textContent = member.name.charAt(0).toUpperCase();
}

function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.member-nav-container');

    if (mobileBtn && navContainer) {
        mobileBtn.onclick = (e) => {
            e.stopPropagation();
            navContainer.classList.toggle('active');
        };

        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && !mobileBtn.contains(e.target)) {
                navContainer.classList.remove('active');
            }
        });
    }
}

// Auto-init si on est dans un module qui n'est pas importé
// (Optionnel selon comment on veut l'utiliser)
