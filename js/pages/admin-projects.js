/**
 * admin-projects.js - Gestion des chantiers et conceptions
 * GAL - Groupement des Artisans de Lubumbashi
 * Version Supabase
 */

import { showToast } from '../ui.js';
import { getProjects, createProject, updateProject, deleteProject } from '../storage.js';
import { createMediaPicker, initMediaPickers } from '../media-picker.js';
import { createSEOAssistantUI, updateSEOAssistant } from '../seo-helper.js';

export async function loadProjectsManager(type) {
    const items = await getProjects(type);
    const title = type === 'chantiers' ? 'Chantiers' : 'Conceptions';
    const subTitle = type === 'chantiers'
        ? 'Gérez vos réalisations sur le terrain.'
        : 'Gérez vos plans et concepts créatifs.';
    const itemLabel = type === 'chantiers' ? 'un chantier' : 'une conception';

    return `
        <div class="page-header">
            <div>
                <h1 class="page-title">Gestion des ${title}</h1>
                <p class="page-subtitle">${subTitle}</p>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="window.adminProjects.showAddModal('${type}')">
                Ajouter ${itemLabel}
            </button>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">${title} enregistrés (${items.length})</h2>
            </div>

            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Aperçu</th>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderRows(items, type)}
                        ${items.length === 0 ? `
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
                                    Aucun élément trouvé.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        ${renderModal(type)}
    `;
}

function renderModal(type) {
    const title = type === 'chantiers' ? 'un Chantier' : 'une Conception';

    return `
        <div id="project-modal" class="admin-modal">
            <div class="admin-modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2 class="modal-title" id="modal-title">Ajouter ${title}</h2>
                    <button class="modal-close" onclick="window.adminProjects.closeModal()">&times;</button>
                </div>
                <form id="project-form" onsubmit="return false;" style="padding: 1.5rem;">
                    <input type="hidden" id="project-id" name="id">
                    <input type="hidden" id="project-type" name="type" value="${type}">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group" style="grid-column: span 2;">
                            <label class="admin-form-label">Titre du projet</label>
                            <input type="text" name="title" class="admin-form-input" placeholder="Ex: Construction Villa..." required>
                        </div>
                        
                        <div class="admin-form-group" style="grid-column: span 2;">
                            <label class="admin-form-label">Description</label>
                            <textarea name="description" class="admin-form-textarea" rows="4" placeholder="Détails du projet..." required></textarea>
                        </div>

                        <div class="admin-form-group" style="grid-column: span 2;">
                            ${createMediaPicker({
        fieldId: 'project-image',
        fieldLabel: 'Image du projet',
        mediaType: 'image',
        placeholder: 'URL ou téléverser...',
        required: true
    })}
                        </div>

                        <div class="admin-form-group">
                            <label class="admin-form-label">Statut</label>
                            <select name="status" class="admin-form-select">
                                <option value="active">En cours / Actif</option>
                                <option value="completed">Terminé</option>
                                <option value="draft">Brouillon / Masqué</option>
                            </select>
                        </div>
                    </div>

                    <div style="margin-top: 2rem;">
                        ${createSEOAssistantUI('project-seo')}
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                        <button type="button" class="admin-btn admin-btn--outline" onclick="window.adminProjects.closeModal()">Annuler</button>
                        <button type="button" class="admin-btn admin-btn--primary" onclick="window.adminProjects.handleSubmit(this)">Enregistrer le projet</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function renderRows(items, type) {
    return items.map(item => `
        <tr>
            <td>
                <img src="${item.image}" alt="${item.title}" 
                     style="width: 80px; height: 50px; object-fit: cover; border-radius: 0.375rem; border: 1px solid var(--admin-border);"
                     onerror="this.src='https://via.placeholder.com/80x50?text=Image'">
            </td>
            <td><span style="font-weight: 600;">${escapeHtml(item.title)}</span></td>
            <td>
                <div style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.8125rem; color: var(--admin-text-muted);">
                    ${escapeHtml(item.description)}
                </div>
            </td>
            <td><span style="font-size: 0.8125rem; color: var(--admin-text-muted);">${new Date(item.created_at || item.createdAt).toLocaleDateString('fr-FR')}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="admin-btn admin-btn--outline" style="padding: 0.25rem 0.5rem;" onclick="window.adminProjects.editItem('${item.id}', '${type}')">✏️</button>
                    <button class="admin-btn admin-btn--danger" style="padding: 0.25rem 0.5rem;" onclick="window.adminProjects.deleteItem('${item.id}', '${type}')">🗑️</button>
                </div>
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
            // Utiliser l'ID project-image créé par le picker
            document.getElementById('project-image').value = item.image;
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
            image: document.getElementById('project-image').value,
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
    // Re-initialiser les pickers après le rafraîchissement
    initMediaPickers();
}

export function initProjectFormHandlers() {
    initMediaPickers();
    
    // SEO Listeners
    document.addEventListener('input', (e) => {
        if (e.target.name === 'title' || e.target.name === 'description') {
            const form = e.target.closest('#project-form');
            if (form) {
                updateSEOAssistant('project-seo', form.title.value, form.description.value);
            }
        }
    });
}
