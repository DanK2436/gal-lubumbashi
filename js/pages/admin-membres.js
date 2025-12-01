/**
 * admin-membres.js - Gestion des membres, messages et annonces
 * GAL - Groupement des Artisans de Lubumbashi
 * Version Supabase avec Délégation d'Événements Globale
 */

import { showToast } from '../ui.js';
import {
    getMembers,
    createMember,
    updateMember,
    deleteMember
} from '../storage.js';

// Fonctions temporaires pour messages/annonces (restent en localStorage pour l'instant)
function getMessages() { return JSON.parse(localStorage.getItem('gal_messages') || '[]'); }
function getAnnonces() { return JSON.parse(localStorage.getItem('gal_member_messages') || '[]'); }

/**
 * Charger et afficher la page de gestion des membres
 */
export async function loadMembresManager(activeTab = 'members') {
    // Charger les données (async pour Supabase)
    let members = [];
    try {
        members = await getMembers();
    } catch (error) {
        console.error('Erreur chargement membres:', error);
        showToast('Erreur lors du chargement des membres', 'error');
    }

    const messages = getMessages();
    const annonces = getAnnonces();

    const html = `
        <div class="members-manager">
            <div class="d-flex justify-between align-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Gestion Espace Membres</h2>
                    <p class="text-muted mt-1">Gérer les membres, messages et annonces</p>
                </div>
                <div class="d-flex gap-3">
                    <div id="actions-members" class="tab-actions" style="display: ${activeTab === 'members' ? 'block' : 'none'}">
                        <button class="btn btn--primary" onclick="window.adminMembres.showAddMemberModal()">
                            ➕ Ajouter un membre
                        </button>
                    </div>
                    <div id="actions-messages" class="tab-actions" style="display: ${activeTab === 'messages' ? 'block' : 'none'}">
                        <button class="btn btn--primary" onclick="window.adminMembres.showMessageModal()">
                            💬 Envoyer un message
                        </button>
                    </div>
                    <div id="actions-annonces" class="tab-actions" style="display: ${activeTab === 'annonces' ? 'block' : 'none'}">
                        <button class="btn btn--primary" onclick="window.adminMembres.sendAnnouncement()">
                            📢 Envoyer une annonce
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs mb-6">
                <button class="tab-btn ${activeTab === 'members' ? 'active' : ''}" onclick="window.adminMembres.switchTab('members', this)">Membres (${members.length})</button>
                <button class="tab-btn ${activeTab === 'messages' ? 'active' : ''}" onclick="window.adminMembres.switchTab('messages', this)">Messages (${messages.length})</button>
                <button class="tab-btn ${activeTab === 'annonces' ? 'active' : ''}" onclick="window.adminMembres.switchTab('annonces', this)">Annonces (${annonces.length})</button>
            </div>

            <!-- Content Sections -->
            <div id="tab-members" class="tab-content ${activeTab === 'members' ? 'active' : ''}">
                <!-- Stats -->
                <div class="stats-grid mb-6">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div>
                                <div class="stat-value">${members.length}</div>
                                <div class="stat-label">Membres inscrits</div>
                            </div>
                            <div class="stat-icon stat-icon--primary">👥</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div>
                                <div class="stat-value">${getRecentMembers(members, 7).length}</div>
                                <div class="stat-label">Nouveaux (7 jours)</div>
                            </div>
                            <div class="stat-icon stat-icon--success">✨</div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter -->
                <div class="admin-card">
                    <div class="d-flex gap-4 mb-4">
                        <input type="search" class="form-input flex-1" placeholder="Rechercher un membre..." oninput="window.adminMembres.filterMembers(this.value)">
                        <select class="form-input" onchange="window.adminMembres.filterByStatus(this.value)">
                            <option value="all">Tous les membres</option>
                            <option value="recent">Nouveaux membres</option>
                        </select>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table" id="members-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderMembersRows(members)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="tab-messages" class="tab-content ${activeTab === 'messages' ? 'active' : ''}">
                <div class="admin-card">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Destinataire</th>
                                    <th>Sujet</th>
                                    <th>Message</th>
                                    <th>Commentaires</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderMessagesRows(messages, members)}
                            </tbody>
                        </table>
                    </div>
                    ${messages.length === 0 ? '<div class="empty-state text-center">Aucun message envoyé</div>' : ''}
                </div>
            </div>

            <div id="tab-annonces" class="tab-content ${activeTab === 'annonces' ? 'active' : ''}">
                <div class="admin-card">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Sujet</th>
                                    <th>Message</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderAnnoncesRows(annonces)}
                            </tbody>
                        </table>
                    </div>
                    ${annonces.length === 0 ? '<div class="empty-state text-center">Aucune annonce envoyée</div>' : ''}
                </div>
            </div>
        </div>

        <!-- Modals (Member, Message, Announcement) -->
        ${renderModals()}

        <style>
            .tabs { display: flex; gap: 1rem; border-bottom: 2px solid var(--color-gray-200); }
            .tab-btn { padding: 0.75rem 1.5rem; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-weight: 600; color: var(--color-text-muted); }
            .tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table th, .data-table td { padding: 0.75rem; border-bottom: 1px solid var(--color-gray-200); text-align: left; }
            .action-btn { cursor: pointer; background: none; border: none; font-size: 1.2rem; margin-right: 0.5rem; }
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
            .modal.active { display: flex; }
            .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
            .form-group { margin-bottom: 1rem; }
            .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
            .form-input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    `;

    return html;
}

function renderModals() {
    return `
        <!-- Member Modal -->
        <div id="member-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="modal-title">Ajouter un membre</h3>
                    <button onclick="window.adminMembres.closeModal('member-modal')">&times;</button>
                </div>
                <form id="member-form">
                    <input type="hidden" id="member-id" name="id">
                    <div class="form-group"><label class="form-label">Nom</label><input type="text" name="name" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">Email</label><input type="email" name="email" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">Téléphone</label><input type="tel" name="phone" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">Mot de passe</label><input type="password" name="password" class="form-input" id="member-password"></div>
                    <button type="submit" class="btn btn--primary w-full">Enregistrer</button>
                </form>
            </div>
        </div>

        <!-- Message Modal -->
        <div id="message-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="message-modal-title">Envoyer un message</h3>
                    <button onclick="window.adminMembres.closeModal('message-modal')">&times;</button>
                </div>
                <form id="message-form">
                    <input type="hidden" id="message-id" name="id">
                    <div class="form-group">
                        <label class="form-label">Destinataire</label>
                        <select name="recipientId" id="message-recipient" class="form-input" required>
                            <option value="">Sélectionner un membre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Sujet</label>
                        <input type="text" name="subject" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea name="message" class="form-input" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn--primary w-full">Envoyer</button>
                </form>
            </div>
        </div>

        <!-- Announcement Modal -->
        <div id="announcement-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="announcement-modal-title">Annonce générale</h3>
                    <button onclick="window.adminMembres.closeModal('announcement-modal')">&times;</button>
                </div>
                <form id="announcement-form">
                    <input type="hidden" id="announcement-id" name="id">
                    <div class="form-group">
                        <label class="form-label">Sujet</label>
                        <input type="text" name="subject" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea name="message" class="form-input" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn--primary w-full">Publier l'annonce</button>
                </form>
            </div>
        </div>
    `;
}

function getRecentMembers(members, days) {
    const now = new Date();
    return members.filter(m => {
        const date = m.created_at || m.createdAt; // Support Supabase & Legacy
        return (now - new Date(date)) / (1000 * 60 * 60 * 24) < days;
    });
}

// Render Rows
function renderMembersRows(members) {
    return members.map(m => `
        <tr>
            <td><strong>${escapeHtml(m.name)}</strong></td>
            <td>${escapeHtml(m.email)}</td>
            <td>${escapeHtml(m.phone || '')}</td>
            <td>${formatDate(m.created_at || m.createdAt)}</td>
            <td>${isRecent(m.created_at || m.createdAt) ? '⭐ Nouveau' : '✓ Actif'}</td>
            <td>
                <button class="action-btn" onclick="window.adminMembres.showMessageModal('${m.id}')" title="Message">💬</button>
                <button class="action-btn" onclick="window.adminMembres.editMember('${m.id}')" title="Modifier">✏️</button>
                <button class="action-btn" onclick="window.adminMembres.deleteMember('${m.id}')" title="Supprimer">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function renderMessagesRows(messages, members) {
    return messages.map(m => {
        const member = members.find(mem => mem.id === m.recipientId);
        const recipientName = member ? member.name : 'Membre inconnu';
        const commentCount = m.comments ? m.comments.length : 0;
        return `
            <tr>
                <td>${formatDate(m.sentAt)}</td>
                <td>${escapeHtml(recipientName)}</td>
                <td>${escapeHtml(m.subject)}</td>
                <td>${escapeHtml(m.message).substring(0, 50)}...</td>
                <td>${commentCount > 0 ? `<span class="badge badge--info">${commentCount}</span>` : '-'}</td>
                <td>
                    <button class="action-btn" onclick="window.adminMembres.editMessage('${m.id}')" title="Modifier">✏️</button>
                    <button class="action-btn" onclick="window.adminMembres.deleteMessage('${m.id}')" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAnnoncesRows(annonces) {
    return annonces.map(a => `
        <tr>
            <td>${formatDate(a.sentAt)}</td>
            <td>${escapeHtml(a.subject)}</td>
            <td>${escapeHtml(a.message).substring(0, 50)}...</td>
            <td>
                <button class="action-btn" onclick="window.adminMembres.editAnnouncement('${a.id}')" title="Modifier">✏️</button>
                <button class="action-btn" onclick="window.adminMembres.deleteAnnouncement('${a.id}')" title="Supprimer">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Helpers
function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
}
function isRecent(date) {
    if (!date) return false;
    return (new Date() - new Date(date)) / (1000 * 60 * 60 * 24) < 7;
}
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global Handlers
window.adminMembres = {
    switchTab(tabName, btnElement) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');
        if (btnElement) {
            btnElement.classList.add('active');
        }

        // Update actions visibility
        document.querySelectorAll('.tab-actions').forEach(el => el.style.display = 'none');
        const actionEl = document.getElementById(`actions-${tabName}`);
        if (actionEl) actionEl.style.display = 'block';
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        const form = document.querySelector(`#${modalId} form`);
        if (form) form.reset();
    },

    // Member Actions
    showAddMemberModal() {
        document.getElementById('member-id').value = '';
        document.getElementById('member-password').required = true;
        document.getElementById('modal-title').textContent = 'Ajouter un membre';
        document.getElementById('member-modal').classList.add('active');
    },
    async editMember(id) {
        try {
            const members = await getMembers();
            const member = members.find(m => m.id === id);
            if (!member) return;
            const form = document.getElementById('member-form');
            document.getElementById('member-id').value = member.id;
            form.name.value = member.name;
            form.email.value = member.email;
            form.phone.value = member.phone || '';
            document.getElementById('member-password').required = false;
            document.getElementById('modal-title').textContent = 'Modifier le membre';
            document.getElementById('member-modal').classList.add('active');
        } catch (error) {
            console.error(error);
            showToast('Erreur chargement membre', 'error');
        }
    },
    async deleteMember(id) {
        if (!confirm('Supprimer ce membre ?')) return;
        try {
            await deleteMember(id);
            await refreshPage();
            showToast('Membre supprimé', 'success');
        } catch (error) {
            console.error(error);
            showToast('Erreur suppression: ' + error.message, 'error');
        }
    },

    // Message Actions
    async showMessageModal(memberId = null) {
        // Populate members dropdown
        try {
            const members = await getMembers();
            const select = document.getElementById('message-recipient');
            select.innerHTML = '<option value="">Sélectionner un membre</option>' +
                members.map(m => `<option value="${m.id}">${escapeHtml(m.name)} (${escapeHtml(m.email)})</option>`).join('');

            if (memberId) {
                select.value = memberId;
            }

            document.getElementById('message-id').value = '';
            document.getElementById('message-modal-title').textContent = 'Envoyer un message';
            document.getElementById('message-modal').classList.add('active');
        } catch (error) {
            console.error(error);
            showToast('Erreur chargement membres', 'error');
        }
    },
    async editMessage(id) {
        const msg = getMessages().find(m => m.id === id);
        if (!msg) return;

        // Populate members dropdown
        try {
            const members = await getMembers();
            const select = document.getElementById('message-recipient');
            select.innerHTML = '<option value="">Sélectionner un membre</option>' +
                members.map(m => `<option value="${m.id}">${escapeHtml(m.name)} (${escapeHtml(m.email)})</option>`).join('');

            const form = document.getElementById('message-form');
            document.getElementById('message-id').value = msg.id;
            select.value = msg.recipientId;
            form.subject.value = msg.subject;
            form.message.value = msg.message;
            document.getElementById('message-modal-title').textContent = 'Modifier le message';
            document.getElementById('message-modal').classList.add('active');
        } catch (error) {
            console.error(error);
        }
    },
    deleteMessage(id) {
        if (!confirm('Supprimer ce message ?')) return;
        const messages = getMessages().filter(m => m.id !== id);
        localStorage.setItem('gal_messages', JSON.stringify(messages));
        refreshPage();
        showToast('Message supprimé', 'success');
    },

    // Announcement Actions
    sendAnnouncement() {
        document.getElementById('announcement-id').value = '';
        document.getElementById('announcement-modal-title').textContent = 'Nouvelle annonce';
        document.getElementById('announcement-modal').classList.add('active');
    },
    editAnnouncement(id) {
        const ann = getAnnonces().find(a => a.id === id);
        if (!ann) return;
        const form = document.getElementById('announcement-form');
        document.getElementById('announcement-id').value = ann.id;
        form.subject.value = ann.subject;
        form.message.value = ann.message;
        document.getElementById('announcement-modal-title').textContent = 'Modifier l\'annonce';
        document.getElementById('announcement-modal').classList.add('active');
    },
    deleteAnnouncement(id) {
        if (!confirm('Supprimer cette annonce ?')) return;
        const annonces = getAnnonces().filter(a => String(a.id) !== String(id));
        localStorage.setItem('gal_member_messages', JSON.stringify(annonces));
        refreshPage();
        showToast('Annonce supprimée', 'success');
    }
};

async function refreshPage() {
    // Trouver l'onglet actif actuel
    const activeTab = document.querySelector('.tab-content.active')?.id.replace('tab-', '') || 'members';
    // Mettre à jour le contenu
    const html = await loadMembresManager(activeTab);
    document.getElementById('admin-main').innerHTML = html;
    // initMemberFormHandlers n'est plus nécessaire avec la délégation globale
}

export function initMemberFormHandlers() {
    // Cette fonction est maintenue pour compatibilité mais ne fait rien
    // Les écouteurs sont gérés globalement par la délégation d'événements ci-dessous
}

// Initialisation des gestionnaires globaux (une seule fois)
// Utilisation d'un flag pour éviter les attachements multiples si le module est rechargé
if (!window.adminMembresEventsInitialized) {
    document.addEventListener('submit', async (e) => {
        // Gestionnaire pour le formulaire membre
        if (e.target && e.target.id === 'member-form') {
            e.preventDefault();
            console.log('Soumission formulaire membre détectée (Global Delegation)');

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            if (submitBtn.disabled) return; // Éviter double soumission

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enregistrement...';

            const formData = new FormData(form);
            const id = formData.get('id');
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            };
            const password = formData.get('password');
            if (password) data.password = password;

            console.log('Données à envoyer:', data);

            try {
                if (id) {
                    console.log('Mode update');
                    await updateMember(id, data);
                    showToast('Membre modifié', 'success');
                } else {
                    console.log('Mode create');
                    await createMember(data);
                    showToast('Membre créé', 'success');
                }
                window.adminMembres.closeModal('member-modal');
                await refreshPage();
            } catch (error) {
                console.error('Erreur soumission:', error);
                showToast('Erreur: ' + error.message, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        }

        // Gestionnaire pour le formulaire message
        else if (e.target && e.target.id === 'message-form') {
            e.preventDefault();
            const formData = new FormData(e.target);
            const messages = getMessages();
            const id = formData.get('id');
            const data = {
                recipientId: formData.get('recipientId'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                sentAt: new Date().toISOString()
            };

            if (id) {
                const index = messages.findIndex(m => m.id === id);
                if (index !== -1) messages[index] = { ...messages[index], ...data };
            } else {
                messages.push({ id: Date.now().toString(), ...data, read: false, comments: [] });
            }
            localStorage.setItem('gal_messages', JSON.stringify(messages));
            window.adminMembres.closeModal('message-modal');
            refreshPage();
            showToast('Message envoyé', 'success');
        }

        // Gestionnaire pour le formulaire annonce
        else if (e.target && e.target.id === 'announcement-form') {
            e.preventDefault();
            const formData = new FormData(e.target);
            const annonces = getAnnonces();
            const id = formData.get('id');
            const data = {
                subject: formData.get('subject'),
                message: formData.get('message'),
                sentAt: new Date().toISOString()
            };

            if (id) {
                const index = annonces.findIndex(a => a.id === id);
                if (index !== -1) annonces[index] = { ...annonces[index], ...data };
            } else {
                annonces.push({ id: Date.now().toString(), ...data, comments: [] });
            }
            localStorage.setItem('gal_member_messages', JSON.stringify(annonces));
            window.adminMembres.closeModal('announcement-modal');
            refreshPage();
            showToast('Annonce publiée', 'success');
        }
    });

    window.adminMembresEventsInitialized = true;
    console.log('Gestionnaires d\'événements globaux initialisés');
}
