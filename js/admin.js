/**
 * admin.js - Module de gestion CRUD admin
 * GAL - Groupement des Artisans de Lubumbashi
 */

import {
    getVideos, createVideo, updateVideo, deleteVideo,
    getFormations, createFormation, updateFormation, deleteFormation,
    getMachines, createMachine, updateMachine, deleteMachine,
    getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
    getReservations, deleteReservation, updateReservationStatus,
    getFormationRegistrations, deleteFormationRegistration, updateFormationRegistrationStatus
} from './storage.js';
import { createMediaPicker } from './media-picker.js';

/**
 * Génère un slug à partir d'un titre
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Affiche un toast de notification
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Charge et affiche la liste des vidéos
 */
export async function loadVideosManager() {
    const videos = await getVideos();

    return `
        <div class="admin-card">
            <div class="d-flex justify-between align-center mb-6">
                <h2>Gestion des Vidéos (${videos.length})</h2>
                <button class="btn btn--primary" onclick="window.adminModule.showVideoForm()">
                    + Ajouter une vidéo
                </button>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Miniature</th>
                            <th>Titre</th>
                            <th>Catégorie</th>
                            <th>Durée</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${videos.map(video => `
                            <tr>
                                <td>
                                    <img src="${video.thumbnail}" alt="${video.title}" 
                                         style="width: 80px; height: 45px; object-fit: cover; border-radius: 4px;">
                                </td>
                                <td><strong>${video.title}</strong></td>
                                <td><span class="badge badge--primary">${video.category}</span></td>
                                <td>${Math.floor(video.durationSeconds / 60)}:${(video.durationSeconds % 60).toString().padStart(2, '0')}</td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn--sm btn--outline" 
                                                onclick="window.adminModule.editVideo('${video.id}')">
                                            ✏️ Modifier
                                        </button>
                                        <button class="btn btn--sm btn--outline" style="color: #ef4444; border-color: #ef4444;"
                                                onclick="window.adminModule.deleteVideo('${video.id}')">
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${videos.length === 0 ? `
                            <tr>
                                <td colspan="5" class="text-center text-muted">
                                    Aucune vidéo pour le moment
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="video-form-modal" class="modal">
            <div class="modal-content" style="width: 95%; max-width: 1200px;">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="video-form-title">Ajouter une vidéo</h3>
                    <button onclick="window.adminModule.closeModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
                </div>
                <form id="video-form">
                    <input type="hidden" id="video-id">
                    
                    <div class="grid grid--3 gap-4 mb-4" style="grid-template-columns: 2fr 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="video-title" class="text-sm mb-1">Titre *</label>
                            <input type="text" id="video-title" class="form-input py-1" required>
                        </div>
                        <div class="form-group mb-0">
                            <label for="video-category" class="text-sm mb-1">Catégorie *</label>
                            <select id="video-category" class="form-select py-1" required>
                                <option value="">Sélectionnez</option>
                                <option value="Électricité">Électricité</option>
                                <option value="Métallurgie">Métallurgie</option>
                                <option value="Menuiserie">Menuiserie</option>
                                <option value="Plomberie">Plomberie</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label for="video-duration" class="text-sm mb-1">Durée (secondes) *</label>
                            <input type="number" id="video-duration" class="form-input py-1" 
                                   min="1" placeholder="120" required>
                        </div>
                    </div>

                    <div class="grid grid--2 gap-4 mb-4">
                        <div class="form-group mb-0">
                            <label for="video-url" class="text-sm mb-1">URL de la vidéo *</label>
                            <input type="url" id="video-url" class="form-input py-1" 
                                   placeholder="https://youtube.com/..." required>
                        </div>
                        <div class="form-group mb-0">
                            ${createMediaPicker({
        fieldId: 'video-thumbnail',
        fieldLabel: 'Miniature',
        mediaType: 'image',
        placeholder: 'https://...',
        required: true
    })}
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" class="btn btn--primary w-full">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <style>
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
            .modal.active { display: flex; }
            .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        </style>
    `;
}

/**
 * Affiche le formulaire de vidéo
 */
export function showVideoForm(videoId = null) {
    const modal = document.getElementById('video-form-modal');
    const form = document.getElementById('video-form');
    const title = document.getElementById('video-form-title');

    modal.classList.add('active');

    if (videoId) {
        title.textContent = 'Modifier la vidéo';
        getVideos().then(videos => {
            const video = videos.find(v => v.id === videoId);
            if (video) {
                document.getElementById('video-id').value = video.id;
                document.getElementById('video-title').value = video.title;
                document.getElementById('video-category').value = video.category;
                document.getElementById('video-url').value = video.url;
                document.getElementById('video-thumbnail').value = video.thumbnail;
                document.getElementById('video-duration').value = video.durationSeconds;
            }
        });
    } else {
        title.textContent = 'Ajouter une vidéo';
        form.reset();
        document.getElementById('video-id').value = '';
    }
}

/**
 * Sauvegarde une vidéo
 */
export async function saveVideo(formData) {
    const videoId = formData.get('id');
    const videoData = {
        title: formData.get('title'),
        category: formData.get('category'),
        url: formData.get('url'),
        thumbnail: formData.get('thumbnail'),
        durationSeconds: parseInt(formData.get('duration'))
    };

    if (videoId) {
        await updateVideo(videoId, videoData);
        showToast('Vidéo modifiée avec succès !');
    } else {
        await createVideo(videoData);
        showToast('Vidéo ajoutée avec succès !');
    }

    closeModal();
    refreshCurrentPage();
}

/**
 * Supprime une vidéo
 */
export async function deleteVideoItem(videoId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
        await deleteVideo(videoId);
        showToast('Vidéo supprimée avec succès !');
        refreshCurrentPage();
    }
}

/**
 * Charge et affiche la liste des formations
 */
export async function loadFormationsManager() {
    const formations = await getFormations();

    return `
        <div class="admin-card">
            <div class="d-flex justify-between align-center mb-6">
                <h2>Gestion des Formations (${formations.length})</h2>
                <button class="btn btn--primary" onclick="window.adminModule.showFormationForm()">
                    + Ajouter une formation
                </button>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Niveau</th>
                            <th>Durée</th>
                            <th>Prix</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${formations.map(formation => `
                            <tr>
                                <td><strong>${formation.title}</strong></td>
                                <td><span class="badge badge--${formation.level === 'Débutant' ? 'success' : formation.level === 'Intermédiaire' ? 'warning' : 'primary'}">${formation.level}</span></td>
                                <td>${formation.duration}</td>
                                <td>${formation.price}</td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn--sm btn--outline" 
                                                onclick="window.adminModule.editFormation('${formation.id}')">
                                            ✏️ Modifier
                                        </button>
                                        <button class="btn btn--sm btn--outline" style="color: #ef4444; border-color: #ef4444;"
                                                onclick="window.adminModule.deleteFormation('${formation.id}')">
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${formations.length === 0 ? `
                            <tr>
                                <td colspan="5" class="text-center text-muted">
                                    Aucune formation pour le moment
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="formation-form-modal" class="modal">
            <div class="modal-content" style="width: 95%; max-width: 1200px;">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="formation-form-title">Ajouter une formation</h3>
                    <button onclick="window.adminModule.closeModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
                </div>
                <form id="formation-form">
                    <input type="hidden" id="formation-id">
                    
                    <div class="grid grid--4 gap-4 mb-4" style="grid-template-columns: 2fr 1fr 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="formation-title" class="text-sm mb-1">Titre *</label>
                            <input type="text" id="formation-title" class="form-input py-1" required>
                        </div>
                        <div class="form-group mb-0">
                            <label for="formation-level" class="text-sm mb-1">Niveau *</label>
                            <select id="formation-level" class="form-select py-1" required>
                                <option value="">Sélectionnez</option>
                                <option value="Débutant">Débutant</option>
                                <option value="Intermédiaire">Intermédiaire</option>
                                <option value="Avancé">Avancé</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label for="formation-duration" class="text-sm mb-1">Durée *</label>
                            <input type="text" id="formation-duration" class="form-input py-1" 
                                   placeholder="Ex: 2 semaines" required>
                        </div>
                        <div class="form-group mb-0">
                            <label for="formation-price" class="text-sm mb-1">Prix *</label>
                            <input type="text" id="formation-price" class="form-input py-1" 
                                   placeholder="Ex: 50 USD" required>
                        </div>
                    </div>

                    <div class="grid grid--2 gap-4" style="grid-template-columns: 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="formation-description" class="text-sm mb-1">Description *</label>
                            <textarea id="formation-description" class="form-input" rows="6" required style="height: 100%;"></textarea>
                        </div>
                        <div class="form-group mb-0">
                            <label for="formation-modules" class="text-sm mb-1">Modules (un par ligne) *</label>
                            <textarea id="formation-modules" class="form-input" rows="6" required style="height: 100%;"></textarea>
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" class="btn btn--primary w-full">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <style>
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
            .modal.active { display: flex; }
            .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        </style>
    `;
}

/**
 * Affiche le formulaire de formation
 */
export function showFormationForm(formationId = null) {
    const modal = document.getElementById('formation-form-modal');
    const form = document.getElementById('formation-form');
    const title = document.getElementById('formation-form-title');

    modal.classList.add('active');

    if (formationId) {
        title.textContent = 'Modifier la formation';
        getFormations().then(formations => {
            const formation = formations.find(f => f.id === formationId);
            if (formation) {
                document.getElementById('formation-id').value = formation.id;
                document.getElementById('formation-title').value = formation.title;
                document.getElementById('formation-description').value = formation.description;
                document.getElementById('formation-level').value = formation.level;
                document.getElementById('formation-duration').value = formation.duration;
                document.getElementById('formation-price').value = formation.price;
                document.getElementById('formation-modules').value = formation.modules.join('\n');
            }
        });
    } else {
        title.textContent = 'Ajouter une formation';
        form.reset();
        document.getElementById('formation-id').value = '';
    }
}

/**
 * Sauvegarde une formation
 */
export async function saveFormation(formData) {
    const formationId = formData.get('id');
    const formationData = {
        title: formData.get('title'),
        description: formData.get('description'),
        level: formData.get('level'),
        duration: formData.get('duration'),
        price: formData.get('price'),
        modules: formData.get('modules').split('\n').filter(m => m.trim())
    };

    if (formationId) {
        await updateFormation(formationId, formationData);
        showToast('Formation modifiée avec succès !');
    } else {
        await createFormation(formationData);
        showToast('Formation ajoutée avec succès !');
    }

    closeModal();
    refreshCurrentPage();
}

/**
 * Supprime une formation
 */
export async function deleteFormationItem(formationId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
        await deleteFormation(formationId);
        showToast('Formation supprimée avec succès !');
        refreshCurrentPage();
    }
}

/**
 * Charge et affiche la liste des machines
 */
export async function loadMachinesManager() {
    const machines = await getMachines();

    return `
        <div class="admin-card">
            <div class="d-flex justify-between align-center mb-6">
                <h2>Gestion des Machines (${machines.length})</h2>
                <button class="btn btn--primary" onclick="window.adminModule.showMachineForm()">
                    + Ajouter une machine
                </button>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Prix</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${machines.map(machine => `
                            <tr>
                                <td>
                                    <img src="${machine.image}" alt="${machine.name}" 
                                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                                </td>
                                <td><strong>${machine.name}</strong></td>
                                <td><span class="badge badge--primary">${machine.category}</span></td>
                                <td>${machine.priceRange || 'N/A'}</td>
                                <td>
                                    <span class="badge badge--${machine.status === 'Disponible' ? 'success' : 'warning'}">
                                        ${machine.status || 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn--sm btn--outline" 
                                                onclick="window.adminModule.editMachine('${machine.id}')">
                                            ✏️ Modifier
                                        </button>
                                        <button class="btn btn--sm btn--outline" style="color: #ef4444; border-color: #ef4444;"
                                                onclick="window.adminModule.deleteMachine('${machine.id}')">
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${machines.length === 0 ? `
                            <tr>
                                <td colspan="6" class="text-center text-muted">
                                    Aucune machine pour le moment
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="machine-form-modal" class="modal">
            <div class="modal-content" style="width: 95%; max-width: 1200px;">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="machine-form-title">Ajouter une machine</h3>
                    <button onclick="window.adminModule.closeModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
                </div>
                <form id="machine-form">
                    <input type="hidden" id="machine-id">
                    
                    <div class="grid grid--3 gap-4 mb-4" style="grid-template-columns: 2fr 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="machine-name">Nom *</label>
                            <input type="text" id="machine-name" class="form-input py-1" required>
                        </div>
                        <div class="form-group mb-0">
                            <label for="machine-category">Catégorie *</label>
                            <select id="machine-category" class="form-select py-1" required>
                                <option value="">Sélectionnez une catégorie</option>
                                <option value="Agroalimentaire">Agroalimentaire</option>
                                <option value="Construction">Construction</option>
                                <option value="Sur Mesure">Sur Mesure</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label for="machine-status">Statut</label>
                            <select id="machine-status" class="form-select py-1">
                                <option value="Disponible">Disponible</option>
                                <option value="Sur commande">Sur commande</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid--2 gap-4 mb-4" style="grid-template-columns: 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="machine-price">Prix</label>
                            <input type="text" id="machine-price" class="form-input py-1"
                                placeholder="Ex: 1200 USD">
                        </div>
                        <div class="form-group mb-0">
                            ${createMediaPicker({
        fieldId: 'machine-image',
        fieldLabel: 'Image de la machine',
        mediaType: 'image',
        placeholder: 'https://...',
        required: true
    })}
                        </div>
                    </div>

                    <div class="form-group mb-4">
                        <label for="machine-specs">Spécifications (Format: clé:valeur, une par ligne)</label>
                        <textarea id="machine-specs" class="form-input" rows="5"
                            placeholder="Capacité:1000 kg/heure&#10;Moteur:Honda 6.5 HP&#10;Garantie:6 mois"></textarea>
                        <small class="text-muted">Une spécification par ligne au format "nom:valeur"</small>
                    </div>

                    <div class="mt-6">
                        <button type="submit" class="btn btn--primary w-full">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <style>
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
            .modal.active { display: flex; }
            .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        </style>
    `;
}

/**
 * Affiche le formulaire de machine
 */
export function showMachineForm(machineId = null) {
    const modal = document.getElementById('machine-form-modal');
    const form = document.getElementById('machine-form');
    const title = document.getElementById('machine-form-title');

    modal.classList.add('active');

    if (machineId) {
        title.textContent = 'Modifier la machine';
        getMachines().then(machines => {
            const machine = machines.find(m => m.id === machineId);
            if (machine) {
                document.getElementById('machine-id').value = machine.id;
                document.getElementById('machine-name').value = machine.name;
                document.getElementById('machine-category').value = machine.category;
                document.getElementById('machine-image').value = machine.image;
                document.getElementById('machine-price').value = machine.priceRange || '';
                document.getElementById('machine-status').value = machine.status || 'Disponible';

                if (machine.specs && Array.isArray(machine.specs)) {
                    const specsText = machine.specs
                        .map(spec => `${spec.label}:${spec.value}`)
                        .join('\n');
                    document.getElementById('machine-specs').value = specsText;
                }
            }
        });
    } else {
        title.textContent = 'Ajouter une machine';
        form.reset();
        document.getElementById('machine-id').value = '';
    }
}

/**
 * Sauvegarde une machine
 */
export async function saveMachine(formData) {
    const machineId = formData.get('id');

    // Parse specs
    const specsText = formData.get('specs');
    const specs = [];
    if (specsText) {
        specsText.split('\n').forEach(line => {
            const [label, value] = line.split(':').map(s => s.trim());
            if (label && value) {
                specs.push({ label, value });
            }
        });
    }

    const machineData = {
        name: formData.get('name'),
        slug: generateSlug(formData.get('name')),
        category: formData.get('category'),
        image: formData.get('image'),
        priceRange: formData.get('price'),
        status: formData.get('status'),
        specs: specs,
        defaultWhatsAppMessage: `Bonjour, je suis intéressé par ${formData.get('name')}. Est-elle disponible ?`
    };

    if (machineId) {
        await updateMachine(machineId, machineData);
        showToast('Machine modifiée avec succès !');
    } else {
        await createMachine(machineData);
        showToast('Machine ajoutée avec succès !');
    }

    closeModal();
    refreshCurrentPage();
}

/**
 * Supprime une machine
 */
export async function deleteMachineItem(machineId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
        await deleteMachine(machineId);
        showToast('Machine supprimée avec succès !');
        refreshCurrentPage();
    }
}

/**
 * Charge et affiche la liste des articles de blog
 */
export async function loadBlogManager() {
    const posts = await getBlogPosts();

    return `
        <div class="admin-card">
            <div class="d-flex justify-between align-center mb-6">
                <h2>Gestion du Blog (${posts.length})</h2>
                <button class="btn btn--primary" onclick="window.adminModule.showBlogForm()">
                    + Nouvel article
                </button>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Catégorie</th>
                            <th>Auteur</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${posts.map(post => `
                            <tr>
                                <td>
                                    <img src="${post.image}" alt="${post.title}" 
                                         style="width: 80px; height: 45px; object-fit: cover; border-radius: 4px;">
                                </td>
                                <td><strong>${post.title}</strong></td>
                                <td><span class="badge badge--primary">${post.category}</span></td>
                                <td>${post.author}</td>
                                <td>${new Date(post.date).toLocaleDateString()}</td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn--sm btn--outline" 
                                                onclick="window.adminModule.editBlogPost('${post.id}')">
                                            ✏️ Modifier
                                        </button>
                                        <button class="btn btn--sm btn--outline" style="color: #ef4444; border-color: #ef4444;"
                                                onclick="window.adminModule.deleteBlogPost('${post.id}')">
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${posts.length === 0 ? `
                            <tr>
                                <td colspan="6" class="text-center text-muted">
                                    Aucun article pour le moment
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="blog-form-modal" class="modal">
            <div class="modal-content" style="width: 95%; max-width: 1200px;">
                <div class="modal-header d-flex justify-between mb-4">
                    <h3 id="blog-form-title">Nouvel article</h3>
                    <button onclick="window.adminModule.closeModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
                </div>
                <form id="blog-form">
                    <input type="hidden" id="blog-id">
                    
                    <div class="grid grid--4 gap-4 mb-4" style="grid-template-columns: 2fr 1fr 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="blog-title" class="text-sm mb-1">Titre *</label>
                            <input type="text" id="blog-title" class="form-input py-1" required>
                        </div>
                        <div class="form-group mb-0">
                            <label for="blog-category" class="text-sm mb-1">Catégorie *</label>
                            <select id="blog-category" class="form-select py-1" required>
                                <option value="">Sélectionnez</option>
                                <option value="Tutoriels">Tutoriels</option>
                                <option value="Actualités">Actualités</option>
                                <option value="Conseils">Conseils</option>
                                <option value="Études de cas">Études de cas</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label for="blog-author" class="text-sm mb-1">Auteur *</label>
                            <input type="text" id="blog-author" class="form-input py-1" required>
                        </div>
                        <div class="form-group mb-0">
                            ${createMediaPicker({
        fieldId: 'blog-image',
        fieldLabel: 'Image principale',
        mediaType: 'image',
        placeholder: 'https://...',
        required: true
    })}
                        </div>
                    </div>

                    <div class="grid grid--3 gap-4" style="grid-template-columns: 1fr 1fr 1fr;">
                        <div class="form-group mb-0">
                            <label for="blog-excerpt" class="text-sm mb-1">Extrait *</label>
                            <textarea id="blog-excerpt" class="form-input" rows="6" required style="height: 100%;"></textarea>
                        </div>
                        <div class="form-group mb-0">
                            <label for="blog-content" class="text-sm mb-1">Contenu complet *</label>
                            <textarea id="blog-content" class="form-input" rows="6" required style="height: 100%;"></textarea>
                        </div>
                        <div class="form-group mb-0">
                            <label for="blog-tags" class="text-sm mb-1">Tags (séparés par des virgules)</label>
                            <textarea id="blog-tags" class="form-input" rows="6" placeholder="Ex: soudure, débutant, sécurité" style="height: 100%;"></textarea>
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" class="btn btn--primary w-full">Publier</button>
                    </div>
                </form>
            </div>
        </div>

        <style>
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
            .modal.active { display: flex; }
            .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        </style>
    `;
}

/**
 * Charge et affiche la liste des réservations
 */
export async function loadReservationsManager() {
    const reservations = await getReservations();

    return `
        <div class="admin-card">
            <div class="d-flex justify-between align-center mb-6">
                <h2>Gestion des Réservations (${reservations.length})</h2>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Client</th>
                            <th>Machine</th>
                            <th>Contact</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map(res => `
                            <tr>
                              <td>${new Date(res.reservation_date || res.created_at).toLocaleDateString('fr-FR')}</td>
                               <td><strong>${res.user_name || 'N/A'}</strong></td>
                               <td>${res.machine_name || 'N/A'}</td>
                                <td>
                                  <div>${res.user_email || 'N/A'}</div>
<div class="text-sm text-muted">${res.user_phone || 'N/A'}</div>
                                </td>
                                <td>
                                    <span class="badge badge--${res.status === 'Confirmé' ? 'success' : res.status === 'En attente' ? 'warning' : 'primary'}">
                                        ${res.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex gap-2">
                                        ${res.status !== 'Confirmé' ? `
                                            <button class="btn btn--sm btn--primary" 
                                                    onclick="window.adminModule.confirmReservation('${res.id}')">
                                                ✅ Confirmer
                                            </button>
                                        ` : ''}
                                        <button class="btn btn--sm btn--outline" style="color: #ef4444; border-color: #ef4444;"
                                                onclick="window.adminModule.deleteReservation('${res.id}')">
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${reservations.length === 0 ? `
                            <tr>
                                <td colspan="6" class="text-center text-muted">
                                    Aucune réservation pour le moment
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Confirme une réservation
 */
export async function confirmReservationItem(id) {
    if (confirm('Voulez-vous confirmer cette réservation ?')) {
        await updateReservationStatus(id, 'Confirmé');
        showToast('Réservation confirmée !');
        refreshCurrentPage();
    }
}

/**
 * Supprime une réservation
 */
export async function deleteReservationItem(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        await deleteReservation(id);
        showToast('Réservation supprimée avec succès !');
        refreshCurrentPage();
    }
}

/**
 * Charge et affiche la liste des inscriptions aux formations
 */
export async function loadFormationRegistrationsManager() {
    const registrations = await getFormationRegistrations();

    return `
        <div class="admin-card">
            <div class="d-flex justify-between align-center mb-6">
                <h2>Inscriptions aux Formations (${registrations.length})</h2>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Participant</th>
                            <th>Formation</th>
                            <th>Contact</th>
                            <th>Niveau</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${registrations.map(reg => `
                            <tr>
                                <td>${new Date(reg.created_at).toLocaleDateString('fr-FR')}</td>
                                <td><strong>${reg.name || 'N/A'}</strong></td>
                                <td>${reg.formation_title || 'N/A'}</td>
                                <td>
                                    <div>${reg.email || 'N/A'}</div>
                                    <div class="text-sm text-muted">${reg.phone || 'N/A'}</div>
                                </td>
                                <td><span class="badge badge--info">${reg.level || 'Non spécifié'}</span></td>
                                <td>
                                    <span class="badge badge--${reg.status === 'Confirmé' ? 'success' : reg.status === 'En attente' ? 'warning' : 'primary'}">
                                        ${reg.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex gap-2">
                                        ${reg.status !== 'Confirmé' ? `
                                            <button class="btn btn--sm btn--primary" 
                                                    onclick="window.adminModule.confirmFormationRegistration('${reg.id}')">
                                                ✅ Confirmer
                                            </button>
                                        ` : ''}
                                        <button class="btn btn--sm btn--outline" style="color: #ef4444; border-color: #ef4444;"
                                                onclick="window.adminModule.deleteFormationRegistration('${reg.id}')">
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${registrations.length === 0 ? `
                            <tr>
                                <td colspan="7" class="text-center text-muted">
                                    Aucune inscription pour le moment
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Confirme une inscription à une formation
 */
export async function confirmFormationRegistrationItem(id) {
    if (confirm('Voulez-vous confirmer cette inscription ?')) {
        await updateFormationRegistrationStatus(id, 'Confirmé');
        showToast('Inscription confirmée !');
        refreshCurrentPage();
    }
}

/**
 * Supprime une inscription à une formation
 */
export async function deleteFormationRegistrationItem(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
        await deleteFormationRegistration(id);
        showToast('Inscription supprimée avec succès !');
        refreshCurrentPage();
    }
}

/**
 * Affiche le formulaire de blog
 
 */
export function showBlogForm(postId = null) {
    const modal = document.getElementById('blog-form-modal');
    const form = document.getElementById('blog-form');
    const title = document.getElementById('blog-form-title');

    modal.classList.add('active');

    if (postId) {
        title.textContent = 'Modifier l\'article';
        getBlogPosts().then(posts => {
            const post = posts.find(p => p.id === postId);
            if (post) {
                document.getElementById('blog-id').value = post.id;
                document.getElementById('blog-title').value = post.title;
                document.getElementById('blog-category').value = post.category;
                document.getElementById('blog-author').value = post.author;
                document.getElementById('blog-excerpt').value = post.excerpt;
                document.getElementById('blog-content').value = post.content;
                document.getElementById('blog-image').value = post.image;
                document.getElementById('blog-tags').value = post.tags ? post.tags.join(', ') : '';
            }
        });
    } else {
        title.textContent = 'Nouvel article';
        form.reset();
        document.getElementById('blog-id').value = '';
    }
}

/**
 * Sauvegarde un article de blog
 */
export async function saveBlogPost(formData) {
    const postId = formData.get('id');
    const tags = formData.get('tags');

    const postData = {
        title: formData.get('title'),
        slug: generateSlug(formData.get('title')),
        category: formData.get('category'),
        author: formData.get('author'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image'),
        tags: tags ? tags.split(',').map(t => t.trim()) : []
    };

    if (postId) {
        await updateBlogPost(postId, postData);
        showToast('Article modifié avec succès !');
    } else {
        await createBlogPost(postData);
        showToast('Article publié avec succès !');
    }

    closeModal();
    refreshCurrentPage();
}

/**
 * Supprime un article de blog
 */
export async function deleteBlogPostItem(postId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        await deleteBlogPost(postId);
        showToast('Article supprimé avec succès !');
        refreshCurrentPage();
    }
}

/**
 * Ferme tous les modaux
 */
export function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('modal--active');
        modal.classList.remove('active');
    });
}

function refreshCurrentPage() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        activeLink.click();
    }
}

// Export global pour utilisation dans le HTML
// Export global pour utilisation dans le HTML
window.adminModule = {
    loadVideosManager,
    showVideoForm,
    editVideo: (id) => showVideoForm(id),
    deleteVideo: deleteVideoItem,

    loadFormationsManager,
    showFormationForm,
    editFormation: (id) => showFormationForm(id),
    deleteFormation: deleteFormationItem,

    loadMachinesManager,
    showMachineForm,
    editMachine: (id) => showMachineForm(id),
    deleteMachine: deleteMachineItem,

    loadReservationsManager,
    confirmReservation: confirmReservationItem,
    deleteReservation: deleteReservationItem,

    loadFormationRegistrationsManager,
    confirmFormationRegistration: confirmFormationRegistrationItem,
    deleteFormationRegistration: deleteFormationRegistrationItem,

    loadBlogManager,
    showBlogForm,
    editBlogPost: (id) => showBlogForm(id),
    deleteBlogPost: deleteBlogPostItem,

    closeModal
};

// Gestionnaires des formulaires via délégation d'événements
document.addEventListener('submit', async (e) => {
    const formId = e.target.id;

    // Video form
    if (formId === 'video-form') {
        e.preventDefault();
        const data = new FormData();
        data.append('id', document.getElementById('video-id').value);
        data.append('title', document.getElementById('video-title').value);
        data.append('category', document.getElementById('video-category').value);
        data.append('url', document.getElementById('video-url').value);
        data.append('thumbnail', document.getElementById('video-thumbnail').value);
        data.append('duration', document.getElementById('video-duration').value);
        await saveVideo(data);
    }

    // Formation form
    else if (formId === 'formation-form') {
        e.preventDefault();
        const data = new FormData();
        data.append('id', document.getElementById('formation-id').value);
        data.append('title', document.getElementById('formation-title').value);
        data.append('description', document.getElementById('formation-description').value);
        data.append('level', document.getElementById('formation-level').value);
        data.append('duration', document.getElementById('formation-duration').value);
        data.append('price', document.getElementById('formation-price').value);
        data.append('modules', document.getElementById('formation-modules').value);
        await saveFormation(data);
    }

    // Machine form
    else if (formId === 'machine-form') {
        e.preventDefault();
        const data = new FormData();
        data.append('id', document.getElementById('machine-id').value);
        data.append('name', document.getElementById('machine-name').value);
        data.append('category', document.getElementById('machine-category').value);
        data.append('image', document.getElementById('machine-image').value);
        data.append('price', document.getElementById('machine-price').value);
        data.append('status', document.getElementById('machine-status').value);
        data.append('specs', document.getElementById('machine-specs').value);
        await saveMachine(data);
    }

    // Blog form
    else if (formId === 'blog-form') {
        e.preventDefault();
        const data = new FormData();
        data.append('id', document.getElementById('blog-id').value);
        data.append('title', document.getElementById('blog-title').value);
        data.append('category', document.getElementById('blog-category').value);
        data.append('author', document.getElementById('blog-author').value);
        data.append('excerpt', document.getElementById('blog-excerpt').value);
        data.append('content', document.getElementById('blog-content').value);
        data.append('image', document.getElementById('blog-image').value);
        data.append('tags', document.getElementById('blog-tags').value);
        await saveBlogPost(data);
    }
});
