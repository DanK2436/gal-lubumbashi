/**
 * member-common.js - Script commun pour toutes les pages membres
 * Gère l'authentification, l'affichage du profil et les notifications
 */

import { getCurrentMember, logout, isAuthenticated } from './auth.js';
import { initNotificationsUI } from '../../js/notifications-ui.js';

export async function initMemberPage() {
    // 1. Menu Mobile (Prioritaire pour l'UI)
    initMobileMenu();

    // 2. Vérifier l'authentification
    if (!isAuthenticated()) {
        window.location.href = '../login.html';
        return null;
    }

    const member = getCurrentMember();
    if (!member) {
        window.location.href = '../login.html';
        return null;
    }

    // 3. Mettre à jour les informations du profil dans le header
    updateHeaderProfile(member);

    // 4. Initialiser les notifications (Asynchrone)
    initNotificationsUI().catch(err => console.error('Erreur notifications:', err));

    // 5. Gérer la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                logout();
            }
        };
    }

    return member;
}

function updateHeaderProfile(member) {
    const nameEl = document.getElementById('member-name');
    const emailEl = document.getElementById('member-email');
    const avatarEl = document.getElementById('member-avatar');

    if (nameEl) nameEl.textContent = member.name || 'Artisan';
    if (emailEl) emailEl.textContent = member.email || '';
    if (avatarEl) {
        const initial = (member.name || 'A').charAt(0).toUpperCase();
        avatarEl.textContent = initial;
    }

    // Mise à jour de la bannière de bienvenue si présente
    const bannerWelcome = document.getElementById('banner-welcome');
    if (bannerWelcome) bannerWelcome.textContent = `Bienvenue, ${member.name}`;
}

function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.member-nav-container');

    if (mobileBtn && navContainer) {
        // Supprimer d'abord l'ancien listener s'il existe via onclick
        mobileBtn.onclick = null;

        const toggleMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            navContainer.classList.toggle('active');
            console.log('Mobile menu toggled:', navContainer.classList.contains('active'));
        };

        mobileBtn.addEventListener('click', toggleMenu);

        // Fermer le menu si on clique sur un lien (mobile UX)
        navContainer.querySelectorAll('.member-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('active');
            });
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (navContainer.classList.contains('active')) {
                const isInside = navContainer.contains(e.target) || mobileBtn.contains(e.target);
                if (!isInside) {
                    navContainer.classList.remove('active');
                }
            }
        });
    }
}

// Auto-init si on est dans un module qui n'est pas importé
// (Optionnel selon comment on veut l'utiliser)
