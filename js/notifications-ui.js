/**
 * notifications-ui.js - Gestion de l'affichage des notifications
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { getNotifications, getUnreadNotificationsCount, markNotificationAsRead } from './storage.js';
import { getCurrentMember } from '../membres/js/auth.js';

/**
 * Initialise le système de notifications dans l'interface
 */
export async function initNotificationsUI() {
    const member = getCurrentMember();
    if (!member) return;

    // 1. Ajouter l'icône de notification dans le header
    addNotificationIconToHeader();

    // 2. Charger le compteur de notifications non lues
    await updateNotificationBadge(member.id);

    // 3. Mettre à jour périodiquement (optionnel, toutes les 5 min)
    setInterval(() => updateNotificationBadge(member.id), 300000);
}

/**
 * Ajoute l'icône de cloche dans le header
 */
function addNotificationIconToHeader() {
    const userSection = document.querySelector('.member-user-section');
    if (!userSection) return;

    // Créer le conteneur de notifications
    const container = document.createElement('div');
    container.className = 'notification-wrapper';
    container.style.cssText = `
        position: relative;
        margin-right: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
    `;

    container.innerHTML = `
        <div class="notification-bell" id="notification-bell" style="font-size: 1.5rem;">🔔</div>
        <span id="notification-badge" class="badge-count" style="
            position: absolute;
            top: -5px;
            right: -8px;
            background: #ef4444;
            color: white;
            font-size: 0.7rem;
            padding: 2px 5px;
            border-radius: 10px;
            display: none;
            font-weight: bold;
            border: 2px solid white;
        ">0</span>
        <div id="notification-dropdown" class="notification-dropdown" style="
            position: absolute;
            top: 100%;
            right: 0;
            width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            display: none;
            z-index: 1000;
            margin-top: 0.5rem;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        ">
            <div class="notif-header" style="
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-between: space-between;
                align-items: center;
                background: #f8fafc;
            ">
                <h3 style="margin:0; font-size: 1rem;">Notifications</h3>
                <button id="mark-all-read" style="
                    background:none; border:none; color: #3b82f6; 
                    font-size: 0.8rem; cursor:pointer; font-weight: 500;
                ">Tout lire</button>
            </div>
            <div id="notif-list" style="max-height: 400px; overflow-y: auto;">
                <!-- Les notifications seront injectées ici -->
                <div style="padding: 2rem; text-align: center; color: #64748b;">
                    Chargement...
                </div>
            </div>
            <div class="notif-footer" style="padding: 0.75rem; text-align: center; border-top: 1px solid #e2e8f0;">
                <a href="#" style="font-size: 0.85rem; color: #64748b; text-decoration: none;">Voir toutes les notifications</a>
            </div>
        </div>
    `;

    userSection.insertBefore(container, userSection.firstChild);

    // Event Listeners
    const bell = document.getElementById('notification-bell');
    const dropdown = document.getElementById('notification-dropdown');

    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            loadNotificationsList();
        }
    });

    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });

    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/**
 * Met à jour le badge de notifications
 */
async function updateNotificationBadge(userId) {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;

    const count = await getUnreadNotificationsCount(userId);
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Charge la liste des notifications dans le dropdown
 */
async function loadNotificationsList() {
    const member = getCurrentMember();
    const listContainer = document.getElementById('notif-list');
    if (!member || !listContainer) return;

    const notifs = await getNotifications(member.id);

    // Trier par date (plus récent en haut)
    notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (notifs.length === 0) {
        listContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #64748b;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📭</div>
                <p style="margin:0;">Aucun notification</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = notifs.slice(0, 10).map(notif => `
        <div class="notif-item ${notif.is_read ? '' : 'unread'}" 
             data-id="${notif.id}"
             data-link="${notif.link || '#'}"
             style="
                padding: 1rem;
                border-bottom: 1px solid #f1f5f9;
                cursor: pointer;
                transition: background 0.2s;
                background: ${notif.is_read ? 'transparent' : '#f0f9ff'};
                display: flex;
                gap: 0.75rem;
             ">
            <div class="notif-icon" style="font-size: 1.25rem;">
                ${getNotificationIcon(notif.type)}
            </div>
            <div class="notif-content" style="flex: 1;">
                <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; color: #1e293b;">
                    ${notif.title}
                </div>
                <div style="font-size: 0.8rem; color: #64748b; line-height: 1.4;">
                    ${notif.message}
                </div>
                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.4rem;">
                    ${formatDate(notif.created_at)}
                </div>
            </div>
            ${notif.is_read ? '' : '<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-top: 5px;"></div>'}
        </div>
    }).join('');

    // Tout marquer comme lu
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const unreadNotifs = notifs.filter(n => !n.is_read);
            if (unreadNotifs.length > 0) {
                const promises = unreadNotifs.map(n => markNotificationAsRead(n.id));
                await Promise.all(promises);
                await updateNotificationBadge(member.id);
                await loadNotificationsList();
            }
        });
    }

    // Ajouter les événements de clic sur les notifications
    document.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', async () => {
            const id = item.dataset.id;
            const link = item.dataset.link;

            await markNotificationAsRead(id);
            await updateNotificationBadge(member.id);

            if (link && link !== '#') {
                window.location.href = link;
            } else {
                item.style.background = 'transparent';
                const dot = item.querySelector('div[style*="background: #3b82f6"]');
                if (dot) dot.remove();
            }
        });
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'project': return '🏗️';
        case 'formation': return '🎓';
        case 'machine': return '⚙️';
        case 'blog': return '📝';
        case 'video': return '🎥';
        case 'announcement': return '📢';
        default: return 'ℹ️';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${ Math.floor(diff / 60000) } min`;
    if (diff < 86400000) return `Il y a ${ Math.floor(diff / 3600000) } h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
