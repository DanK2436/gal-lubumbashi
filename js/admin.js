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
import { createMediaPicker, initMediaPickers } from './media-picker.js';
import { createSEOAssistantUI, updateSEOAssistant } from './seo-helper.js';

/**
 * Sanitize HTML to prevent XSS
 */
function sanitizeHTML(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

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
    toast.className = `admin-toast admin-toast--${type}`;

    let icon = '✅';
    if (type === 'danger') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Charge et affiche la liste des vidéos
 */
export async function loadVideosManager() {
    const videos = await getVideos();

    return `
        <div class="page-header">
            <h1 class="page-title">Gestion des Vidéos</h1>
            <p class="page-subtitle">Gérez les tutoriels et vidéos de formation de la plateforme.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Catalogue Vidéos (${videos.length})</h2>
                <button class="admin-btn admin-btn--primary" onclick="window.adminModule.showVideoForm()">
                    <span>➕</span> Ajouter une vidéo
                </button>
            </div>

            <div class="table-container">
                <table class="admin-table">
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
                                <td class="thumbnail-cell">
                                    <img src="${video.thumbnail}" alt="${sanitizeHTML(video.title)}">
                                </td>
                                <td><span class="font-semibold">${sanitizeHTML(video.title)}</span></td>
                                <td><span class="badge badge--success">${sanitizeHTML(video.category)}</span></td>
                                <td>${Math.floor(video.durationSeconds / 60)}:${(video.durationSeconds % 60).toString().padStart(2, '0')}</td>
                                <td>
                                    <div class="actions-cell">
                                        <button class="admin-btn admin-btn--outline btn-xs" 
                                                onclick="window.adminModule.editVideo('${video.id}')">
                                            ✏️
                                        </button>
                                        <button class="admin-btn admin-btn--danger btn-xs"
                                                onclick="window.adminModule.deleteVideo('${video.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${videos.length === 0 ? `
                            <tr>
                                <td colspan="5" class="empty-state">
                                    Aucune vidéo répertoriée. Commencez par en ajouter une !
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="video-form-modal" class="admin-modal">
            <div class="admin-modal-content">
                <div class="modal-header">
                    <h3 id="video-form-title" class="page-title" style="font-size: 1.5rem; margin: 0;">Ajouter une vidéo</h3>
                    <button class="modal-close" onclick="window.adminModule.closeModal()">&times;</button>
                </div>
                <form id="video-form">
                    <input type="hidden" id="video-id">
                    
                    <div class="admin-form-group">
                        <label for="video-title" class="admin-form-label">Titre de la vidéo *</label>
                        <input type="text" id="video-title" class="admin-form-input" placeholder="Ex: Introduction à la soudure" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group">
                            <label for="video-category" class="admin-form-label">Catégorie *</label>
                            <select id="video-category" class="admin-form-select" required>
                                <option value="">Choisir une catégorie</option>
                                <option value="Électricité">Électricité</option>
                                <option value="Métallurgie">Métallurgie</option>
                                <option value="Electronique">Electronique</option>
                                <option value="soudure">soudure</option>
                                 <option value="CAO">CAO</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group">
                            ${createMediaPicker({
        fieldId: 'video-url',
        fieldLabel: 'Fichier Vidéo ou URL YouTube *',
        mediaType: 'video',
        placeholder: 'Lien ou téléversement...',
        required: true
    })}
                        </div>
                        <div class="admin-form-group">
                            ${createMediaPicker({
        fieldId: 'video-thumbnail',
        fieldLabel: 'Image de miniature *',
        mediaType: 'image',
        placeholder: 'Lien ou téléversement...',
        required: true
    })}
                        </div>
                    </div>

                    <div style="margin-top: 2rem;">
                        ${createSEOAssistantUI('video-seo')}
                        <button type="submit" class="admin-btn admin-btn--primary w-full" style="justify-content: center; padding: 1rem; margin-top: 1rem;">
                            Enregistrer la vidéo
                        </button>
                    </div>
                </form>
            </div>
        </div>
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
        <div class="page-header">
            <h1 class="page-title">Gestion des Formations</h1>
            <p class="page-subtitle">Pilotez le catalogue des compétences et formations GAL.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Catalogue Formations (${formations.length})</h2>
                <button class="admin-btn admin-btn--primary" onclick="window.adminModule.showFormationForm()">
                    <span>➕</span> Créer une formation
                </button>
            </div>

            <div class="table-container">
                <table class="admin-table">
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
                                <td><span class="font-semibold">${sanitizeHTML(formation.title)}</span></td>
                                <td>
                                    <span class="badge ${formation.level === 'Débutant' ? 'badge--success' : formation.level === 'Intermédiaire' ? 'badge--pending' : 'badge--primary'}">
                                        ${sanitizeHTML(formation.level)}
                                    </span>
                                </td>
                                <td>${sanitizeHTML(formation.duration)}</td>
                                <td><span class="text-primary font-semibold">${sanitizeHTML(formation.price)}</span></td>
                                <td>
                                    <div class="actions-cell">
                                        <button class="admin-btn admin-btn--outline btn-xs" 
                                                onclick="window.adminModule.editFormation('${formation.id}')">
                                            ✏️
                                        </button>
                                        <button class="admin-btn admin-btn--danger btn-xs"
                                                onclick="window.adminModule.deleteFormation('${formation.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${formations.length === 0 ? `
                            <tr>
                                <td colspan="5" class="empty-state">
                                    Aucune formation répertoriée.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

    <div id="formation-form-modal" class="admin-modal">
        <div class="admin-modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h3 id="formation-form-title" class="page-title" style="font-size: 1.5rem; margin: 0;">Ajouter une formation</h3>
                <button class="modal-close" onclick="window.adminModule.closeModal()">&times;</button>
            </div>
            <form id="formation-form">
                <input type="hidden" id="formation-id">

                    <div class="admin-form-group">
                        <label for="formation-title" class="admin-form-label">Titre de la formation *</label>
                        <input type="text" id="formation-title" class="admin-form-input" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="admin-form-group">
                            <label for="formation-level" class="admin-form-label">Niveau *</label>
                            <select id="formation-level" class="admin-form-select" required>
                                <option value="">Choisir</option>
                                <option value="Débutant">Débutant</option>
                                <option value="Intermédiaire">Intermédiaire</option>
                                <option value="Avancé">Avancé</option>
                            </select>
                        </div>
                        <div class="admin-form-group">
                            <label for="formation-duration" class="admin-form-label">Durée *</label>
                            <input type="text" id="formation-duration" class="admin-form-input" placeholder="Ex: 2 semaines" required>
                        </div>
                        <div class="admin-form-group">
                            <label for="formation-price" class="admin-form-label">Prix *</label>
                            <input type="text" id="formation-price" class="admin-form-input" placeholder="Ex: 50 USD" required>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group">
                            <label for="formation-description" class="admin-form-label">Description détaillée *</label>
                            <textarea id="formation-description" class="admin-form-textarea" rows="4" required style="height: 120px;"></textarea>
                        </div>
                        <div class="admin-form-group">
                            <label for="formation-modules" class="admin-form-label">Modules (un par ligne) *</label>
                            <textarea id="formation-modules" class="admin-form-textarea" rows="4" required style="height: 120px;"></textarea>
                        </div>
                    </div>

                    <div class="admin-form-group">
                        ${createMediaPicker({
        fieldId: 'formation-image',
        fieldLabel: 'Image de couverture *',
        mediaType: 'image',
        placeholder: 'Lien ou téléversement...',
        required: true
    })}
                    </div>

                    <div style="margin-top: 2rem;">
                        ${createSEOAssistantUI('formation-seo')}
                        <button type="submit" class="admin-btn admin-btn--primary w-full" style="justify-content: center; padding: 1rem; margin-top: 1rem;">
                            Enregistrer la formation
                        </button>
                    </div>
            </form>
        </div>
    </div>
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
                document.getElementById('formation-image').value = formation.image || '';
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
        image: formData.get('image'),
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
        <div class="page-header">
            <h1 class="page-title">Gestion du Parc Machines</h1>
            <p class="page-subtitle">Inventaire et maintenance des équipements disponibles.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Inventaire Machines (${machines.length})</h2>
                <button class="admin-btn admin-btn--primary" onclick="window.adminModule.showMachineForm()">
                    <span>➕</span> Ajouter un équipement
                </button>
            </div>

            <div class="table-container">
                <table class="admin-table">
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
                                <td class="thumbnail-cell">
                                    <img src="${machine.image}" alt="${sanitizeHTML(machine.name)}">
                                </td>
                                <td><span class="font-semibold">${sanitizeHTML(machine.name)}</span></td>
                                <td><span class="badge badge--success">${sanitizeHTML(machine.category)}</span></td>
                                <td><span class="text-primary font-semibold">${sanitizeHTML(machine.priceRange || 'N/A')}</span></td>
                                <td>
                                    <span class="badge ${machine.status === 'Disponible' ? 'badge--success' : 'badge--pending'}">
                                        ${sanitizeHTML(machine.status || 'N/A')}
                                    </span>
                                </td>
                                <td>
                                    <div class="actions-cell">
                                        <button class="admin-btn admin-btn--outline btn-xs" 
                                                onclick="window.adminModule.editMachine('${machine.id}')">
                                            ✏️
                                        </button>
                                        <button class="admin-btn admin-btn--danger btn-xs"
                                                onclick="window.adminModule.deleteMachine('${machine.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${machines.length === 0 ? `
                            <tr>
                                <td colspan="6" class="empty-state">
                                    Aucune machine enregistrée.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="machine-form-modal" class="admin-modal">
            <div class="admin-modal-content">
                <div class="modal-header">
                    <h3 id="machine-form-title" class="page-title" style="font-size: 1.5rem; margin: 0;">Ajouter une machine</h3>
                    <button class="modal-close" onclick="window.adminModule.closeModal()">&times;</button>
                </div>
                <form id="machine-form">
                    <input type="hidden" id="machine-id">
                    
                    <div class="admin-form-group">
                        <label for="machine-name" class="admin-form-label">Nom de l'équipement *</label>
                        <input type="text" id="machine-name" class="admin-form-input" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group">
                            <label for="machine-category" class="admin-form-label">Catégorie *</label>
                            <select id="machine-category" class="admin-form-select" required>
                                <option value="">Choisir</option>
                                <option value="Agroalimentaire">Agroalimentaire</option>
                                <option value="Construction">Construction</option>
                                <option value="Sur Mesure">Sur Mesure</option>
                            </select>
                        </div>
                        <div class="admin-form-group">
                            <label for="machine-price" class="admin-form-label">Prix indicatif *</label>
                            <input type="text" id="machine-price" class="admin-form-input" placeholder="Ex: 1500 USD" required>
                        </div>
                    </div>

                    <div class="admin-form-group">
                        <label for="machine-status" class="admin-form-label">Statut *</label>
                        <select id="machine-status" class="admin-form-select" required>
                            <option value="Disponible">Disponible</option>
                            <option value="Sur commande">Sur commande</option>
                            <option value="En maintenance">En maintenance</option>
                        </select>
                    </div>

                    <div class="admin-form-group">
                        <label for="machine-description" class="admin-form-label">Description générale</label>
                        <textarea id="machine-description" class="admin-form-textarea" rows="2" placeholder="Brève description..."></textarea>
                    </div>

                    <div class="admin-form-group">
                        <label for="machine-specs" class="admin-form-label">Spécifications techniques (Format: clé:valeur, une par ligne)</label>
                        <textarea id="machine-specs" class="admin-form-textarea" rows="4" placeholder="Capacité:1000 kg/heure&#10;Moteur:Honda 6.5 HP"></textarea>
                    </div>

                    <div class="admin-form-group">
                        ${createMediaPicker({
        fieldId: 'machine-image',
        fieldLabel: 'Photo de la machine *',
        mediaType: 'image',
        placeholder: 'Lien ou téléversement...',
        required: true
    })}
                    </div>

                    <div style="margin-top: 2rem;">
                        ${createSEOAssistantUI('machine-seo')}
                        <button type="submit" class="admin-btn admin-btn--primary w-full" style="justify-content: center; padding: 1rem; margin-top: 1rem;">
                            Enregistrer l'équipement
                        </button>
                    </div>
                </form>
            </div>
        </div>
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
                        .map(spec => `${spec.label}:${spec.value} `)
                        .join('\n');
                    document.getElementById('machine-specs').value = specsText;
                }
                document.getElementById('machine-description').value = machine.description || '';
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
        description: formData.get('description'),
        specs: specs,
        defaultWhatsAppMessage: `Bonjour, je suis intéressé par ${formData.get('name')}.Est - elle disponible ? `
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
        <div class="page-header">
            <h1 class="page-title">Gestion du Blog</h1>
            <p class="page-subtitle">Publiez des articles, tutoriels et actualités pour la communauté.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Articles Publiés (${posts.length})</h2>
                <button class="admin-btn admin-btn--primary" onclick="window.adminModule.showBlogForm()">
                    <span>➕</span> Nouvel article
                </button>
            </div>

            <div class="table-container">
                <table class="admin-table">
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
                                <td class="thumbnail-cell">
                                    <img src="${post.image}" alt="${sanitizeHTML(post.title)}">
                                </td>
                                <td><span class="font-semibold">${sanitizeHTML(post.title)}</span></td>
                                <td><span class="badge badge--primary">${sanitizeHTML(post.category)}</span></td>
                                <td><span class="text-base">${sanitizeHTML(post.author)}</span></td>
                                <td><span class="text-sm text-muted">${new Date(post.date).toLocaleDateString()}</span></td>
                                <td>
                                    <div class="actions-cell">
                                        <button class="admin-btn admin-btn--outline btn-xs" 
                                                onclick="window.adminModule.editBlogPost('${post.id}')">
                                            ✏️
                                        </button>
                                        <button class="admin-btn admin-btn--danger btn-xs"
                                                onclick="window.adminModule.deleteBlogPost('${post.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${posts.length === 0 ? `
                            <tr>
                                <td colspan="6" class="empty-state">
                                    Aucun article pour le moment.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="blog-form-modal" class="admin-modal">
            <div class="admin-modal-content" style="max-width: 1000px;">
                <div class="modal-header">
                    <h3 id="blog-form-title" class="page-title" style="font-size: 1.5rem; margin: 0;">Rédiger un article</h3>
                    <button class="modal-close" onclick="window.adminModule.closeModal()">&times;</button>
                </div>
                <form id="blog-form">
                    <input type="hidden" id="blog-id">
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group">
                            <label for="blog-title" class="admin-form-label">Titre de l'article *</label>
                            <input type="text" id="blog-title" class="admin-form-input" placeholder="Titre accrocheur..." required>
                        </div>
                        <div class="admin-form-group">
                            <label for="blog-category" class="admin-form-label">Catégorie *</label>
                            <select id="blog-category" class="admin-form-select" required>
                                <option value="">Choisir</option>
                                <option value="Tutoriels">Tutoriels</option>
                                <option value="Actualités">Actualités</option>
                                <option value="Conseils">Conseils</option>
                                <option value="Études de cas">Études de cas</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="admin-form-group">
                            <label for="blog-author" class="admin-form-label">Auteur *</label>
                            <input type="text" id="blog-author" class="admin-form-input" value="Admin GAL" required>
                        </div>
                        <div class="admin-form-group">
                            ${createMediaPicker({
        fieldId: 'blog-image',
        fieldLabel: 'Image de couverture *',
        mediaType: 'image',
        placeholder: 'Lien ou téléversement...',
        required: true
    })}
                        </div>
                    </div>

                    <div class="admin-form-group">
                        <label for="blog-excerpt" class="admin-form-label">Extrait (résumé rapide) *</label>
                        <textarea id="blog-excerpt" class="admin-form-textarea" rows="2" placeholder="Saisissez un court résumé..." required></textarea>
                    </div>

                    <div class="admin-form-group">
                        <label for="blog-content" class="admin-form-label">Contenu de l'article *</label>
                        <textarea id="blog-content" class="admin-form-textarea" rows="10" placeholder="Rédigez votre article ici..." required></textarea>
                    </div>

                    <div class="admin-form-group">
                        <label for="blog-tags" class="admin-form-label">Tags (séparés par des virgules)</label>
                        <input type="text" id="blog-tags" class="admin-form-input" placeholder="Ex: soudure, bois, artisanat">
                    </div>

                    <div style="margin-top: 2rem;">
                        ${createSEOAssistantUI('blog-seo')}
                        <button type="submit" class="admin-btn admin-btn--primary w-full" style="justify-content: center; padding: 1rem; margin-top: 1rem;">
                            Publier l'article
                        </button>
                    </div>
                </form>
            </div>
        </div>
`;
}

/**
 * Charge et affiche la liste des réservations
 */
export async function loadReservationsManager() {
    const reservations = await getReservations();

    return `
    <div class="page-header">
            <h1 class="page-title">Réservations Machines</h1>
            <p class="page-subtitle">Suivez et validez les demandes de réservation du parc machines.</p>
        </div>

    <div class="admin-card">
        <div class="card-header">
            <h2 class="card-title">Demandes en cours (${reservations.length})</h2>
        </div>

        <div class="table-container">
            <table class="admin-table">
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
                            <td><span class="text-sm text-muted">${new Date(res.reservation_date || res.created_at).toLocaleDateString('fr-FR')}</span></td>
                            <td><span class="font-semibold">${sanitizeHTML(res.user_name || 'N/A')}</span></td>
                            <td><span class="badge badge--primary">${sanitizeHTML(res.machine_name || 'N/A')}</span></td>
                            <td>
                                <div class="text-sm">${sanitizeHTML(res.user_email || 'N/A')}</div>
                                <div class="text-xs text-muted">${sanitizeHTML(res.user_phone || 'N/A')}</div>
                            </td>
                            <td>
                                <span class="badge ${res.status === 'Confirmé' ? 'badge--success' : res.status === 'En attente' ? 'badge--pending' : 'badge--primary'}">
                                    ${sanitizeHTML(res.status)}
                                </span>
                            </td>
                            <td>
                                <div class="actions-cell">
                                    ${res.status !== 'Confirmé' ? `
                                        <button class="admin-btn admin-btn--primary btn-xs" 
                                                onclick="window.adminModule.confirmReservation('${res.id}')">
                                            Confirmer
                                        </button>
                                    ` : ''}
                                    <button class="admin-btn admin-btn--danger btn-xs"
                                            onclick="window.adminModule.deleteReservation('${res.id}')">
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                    ${reservations.length === 0 ? `
                        <tr>
                            <td colspan="6" class="empty-state">
                                Aucune réservation active.
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
    <div class="page-header">
            <h1 class="page-title">Inscriptions Formations</h1>
            <p class="page-subtitle">Gérez les demandes de participation aux différentes formations.</p>
        </div>

    <div class="admin-card">
        <div class="card-header">
            <h2 class="card-title">Inscriptions reçues (${registrations.length})</h2>
        </div>

        <div class="table-container">
            <table class="admin-table">
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
                            <td><span class="text-sm text-muted">${new Date(reg.created_at).toLocaleDateString('fr-FR')}</span></td>
                            <td><span class="font-semibold">${sanitizeHTML(reg.name || 'N/A')}</span></td>
                            <td><span class="badge badge--primary">${sanitizeHTML(reg.formation_title || 'N/A')}</span></td>
                            <td>
                                <div class="text-sm">${sanitizeHTML(reg.email || 'N/A')}</div>
                                <div class="text-xs text-muted">${sanitizeHTML(reg.phone || 'N/A')}</div>
                            </td>
                            <td><span class="badge badge--pending">${sanitizeHTML(reg.level || 'Non spécifié')}</span></td>
                            <td>
                                <span class="badge ${reg.status === 'Confirmé' ? 'badge--success' : reg.status === 'En attente' ? 'badge--pending' : 'badge--primary'}">
                                    ${sanitizeHTML(reg.status)}
                                </span>
                            </td>
                            <td>
                                <div class="actions-cell">
                                    ${reg.status !== 'Confirmé' ? `
                                        <button class="admin-btn admin-btn--primary btn-xs"
                                                onclick="window.adminModule.confirmFormationRegistration('${reg.id}')">
                                            Confirmer
                                        </button>
                                    ` : ''}
                                    <button class="admin-btn admin-btn--danger btn-xs"
                                            onclick="window.adminModule.deleteFormationRegistration('${reg.id}')">
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                    ${registrations.length === 0 ? `
                        <tr>
                            <td colspan="7" class="empty-state">
                                Aucune inscription pour le moment.
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
                document.getElementById('blog-excerpt').value = post.excerpt || post.description || '';
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
/**
 * Ferme tous les modaux
 */
export function closeModal() {
    document.querySelectorAll('.admin-modal, .modal').forEach(modal => {
        modal.classList.remove('active');
        // Fallback for older styles
        modal.style.display = '';
        modal.classList.remove('modal--active');
    });
}

function refreshCurrentPage() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        activeLink.click();
    }
}

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
        data.append('image', document.getElementById('formation-image').value);
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
        data.append('description', document.getElementById('machine-description').value);
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

// Initialisation des écouteurs SEO temps réel
document.addEventListener('input', (e) => {
    const id = e.target.id;
    if (id.startsWith('video-')) {
        updateSEOAssistant('video-seo', document.getElementById('video-title').value, document.getElementById('video-category').value);
    } else if (id.startsWith('formation-')) {
        updateSEOAssistant('formation-seo', document.getElementById('formation-title').value, document.getElementById('formation-description').value);
    } else if (id.startsWith('machine-')) {
        updateSEOAssistant('machine-seo', document.getElementById('machine-name').value, document.getElementById('machine-description').value);
    } else if (id.startsWith('blog-')) {
        updateSEOAssistant('blog-seo', document.getElementById('blog-title').value, document.getElementById('blog-excerpt').value + ' ' + document.getElementById('blog-content').value);
    }
});

// Initialisation au chargement
initMediaPickers();
