/**
 * admin-projects.js - Gestion des chantiers et conceptions
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { showToast } from '../ui.js';

export function loadProjectsManager(type) {
    const items = getItems(type);
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
                <form id="project-form">
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

                    <button type="submit" class="btn btn--primary w-full">Enregistrer</button>
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

function getItems(type) {
    return JSON.parse(localStorage.getItem(`gal_${type}`) || '[]');
}

function renderRows(items, type) {
    return items.map(item => `
        <tr>
            <td><img src="${item.image}" class="thumbnail" alt="${item.title}" onerror="this.src='https://via.placeholder.com/60x40'"></td>
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td>${escapeHtml(item.description).substring(0, 50)}...</td>
            <td>${new Date(item.createdAt).toLocaleDateString('fr-FR')}</td>
            <td>
                <button class="action-btn" onclick="window.adminProjects.editItem('${item.id}', '${type}')">✏️</button>
                <button class="action-btn" onclick="window.adminProjects.deleteItem('${item.id}', '${type}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function escapeHtml(text) {
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

    editItem(id, type) {
        const items = getItems(type);
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
    },

    deleteItem(id, type) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
        const items = getItems(type).filter(i => i.id !== id);
        localStorage.setItem(`gal_${type}`, JSON.stringify(items));
        refreshPage(type);
        showToast('Élément supprimé', 'success');
    }
};

function refreshPage(type) {
    document.getElementById('admin-main').innerHTML = loadProjectsManager(type);
    initProjectFormHandlers();
}

export function initProjectFormHandlers() {
    const form = document.getElementById('project-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const type = formData.get('type');
            const id = formData.get('id');
            const items = getItems(type);

            const data = {
                title: formData.get('title'),
                description: formData.get('description'),
                image: formData.get('image'),
                status: formData.get('status'),
                updatedAt: new Date().toISOString()
            };

            if (id) {
                const index = items.findIndex(i => i.id === id);
                if (index !== -1) {
                    items[index] = { ...items[index], ...data };
                }
            } else {
                items.push({
                    id: Date.now().toString(),
                    ...data,
                    createdAt: new Date().toISOString()
                });
            }

            localStorage.setItem(`gal_${type}`, JSON.stringify(items));
            window.adminProjects.closeModal();
            refreshPage(type);
            showToast('Enregistré avec succès', 'success');
        });
    }
}
