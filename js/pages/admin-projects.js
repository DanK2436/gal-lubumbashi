/**
 * admin-projects.js - Gestion des chantiers et conceptions
 * GAL - Groupement des Artisans de Lubumbashi
 * Version Supabase
 */

import { showToast } from '../ui.js';
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} from '../storage.js';

export async function loadProjectsManager(type) {
    const items = await getProjects(type);
    const title = type === 'chantiers' ? 'Chantiers' : 'Conceptions';
    const icon = type === 'chantiers' ? '🏗️' : '📐';
    const itemLabel = type === 'chantiers' ? 'un chantier' : 'une conception';

    return `
        <div class="projects-manager">
            <div class="d-flex justify-between align-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Gestion des ${title}</h2>
                    <p class="text-muted mt-1">Gérer les ${title.toLowerCase()} visibles par les membres</p>
                </div>
                <button class="btn btn--primary" onclick="window.adminProjects.showAddModal('${type}')">
                    ➕ Ajouter ${itemLabel}
                </button>
            </div>

            <div class="admin-card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderRows(items, type)}
                        </tbody>
                    </table>
                </div>
                ${items.length === 0 ? `<div class="empty-state text-center">Aucun élément trouvé</div>` : ''}
            </div>
        </div>

        ${renderModal(type)}
    `;
}

function renderModal(type) {
    const title = type === 'chantiers' ? 'Chantiers' : 'Conceptions';

    return `
        <div id="project-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="modal-title">Ajouter</h3>
                    <button onclick="window.adminProjects.closeModal()">&times;</button>
                </div>
                <form id="project-form" onsubmit="return false;">
                    <input type="hidden" id="project-id" name="id">
                    <input type="hidden" id="project-type" name="type" value="${type}">
                    
                    <div class="form-group">
                        <label class="form-label">Titre</label>
                        <input type="text" name="title" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-input" rows="4" required></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">URL de l'image</label>
                        <input type="url" name="image" class="form-input" placeholder="https://..." required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Statut</label>
                        <select name="status" class="form-input">
                            <option value="active">Actif</option>
                            <option value="completed">Terminé</option>
                            <option value="draft">Brouillon</option>
                        </select>
                    </div>

                    <button type="button" class="btn btn--primary w-full" onclick="window.adminProjects.handleSubmit(this)">Enregistrer</button>
                </form>
            </div>
        </div>

        <style>
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
            .modal.active { display: flex; }
            .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; }
            .thumbnail { width: 60px; height: 40px; object-fit: cover; border-radius: 4px; }
        </style>
    `;
}

function renderRows(items, type) {
    return items.map(item => `
        <tr>
            <td><img src="${item.image}" class="thumbnail" alt="${item.title}" onerror="this.src='https://via.placeholder.com/60x40'"></td>
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td>${escapeHtml(item.description).substring(0, 50)}...</td>
            <td>${new Date(item.created_at || item.createdAt).toLocaleDateString('fr-FR')}</td>
            <td>
                <button class="action-btn" onclick="window.adminProjects.editItem('${item.id}', '${type}')">✏️</button>
                <button class="action-btn" onclick="window.adminProjects.deleteItem('${item.id}', '${type}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global Handlers
window.adminProjects = {
    closeModal() {
        document.getElementById('project-modal').classList.remove('active');
        document.getElementById('project-form').reset();
    },

    showAddModal(type) {
        document.getElementById('project-id').value = '';
        document.getElementById('project-type').value = type;
        document.getElementById('modal-title').textContent = type === 'chantiers' ? 'Ajouter un chantier' : 'Ajouter une conception';
        document.getElementById('project-modal').classList.add('active');
    },

    async editItem(id, type) {
        try {
            const items = await getProjects(type);
            const item = items.find(i => i.id === id);
            if (!item) return;

            const form = document.getElementById('project-form');
            document.getElementById('project-id').value = item.id;
            document.getElementById('project-type').value = type;
            form.title.value = item.title;
            form.description.value = item.description;
            form.image.value = item.image;
            form.status.value = item.status || 'active';

            document.getElementById('modal-title').textContent = 'Modifier';
            document.getElementById('project-modal').classList.add('active');
        } catch (error) {
            console.error(error);
            showToast('Erreur chargement projet', 'error');
        }
    },

    async deleteItem(id, type) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
        try {
            await deleteProject(id);
            await refreshPage(type);
            showToast('Élément supprimé', 'success');
        } catch (error) {
            console.error(error);
            showToast('Erreur suppression: ' + error.message, 'error');
        }
    },

    async handleSubmit(btn) {
        console.log('handleSubmit appelé pour projet');

        if (!btn) return;
        const form = btn.closest('form');

        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const originalText = btn.innerHTML;
        if (btn.disabled) return;

        btn.disabled = true;
        btn.innerHTML = 'Enregistrement...';

        const formData = new FormData(form);
        const type = formData.get('type');
        const id = formData.get('id');

        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image'),
            type: type,
            status: formData.get('status')
        };

        console.log('Données projet à envoyer:', data);

        try {
            if (id) {
                console.log('Mode update projet');
                await updateProject(id, data);
                showToast('Projet modifié', 'success');
            } else {
                console.log('Mode create projet');
                await createProject(data);
                showToast('Projet créé', 'success');
            }
            window.adminProjects.closeModal();
            await refreshPage(type);
        } catch (error) {
            console.error('Erreur soumission projet:', error);
            showToast('Erreur: ' + error.message, 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        }
    }
};

async function refreshPage(type) {
    const html = await loadProjectsManager(type);
    document.getElementById('admin-main').innerHTML = html;
    initProjectFormHandlers();
}

export function initProjectFormHandlers() {
    // Les gestionnaires sont maintenant globaux via window.adminProjects.handleSubmit
    console.log('initProjectFormHandlers appelé (gestionnaires globaux actifs)');
}
