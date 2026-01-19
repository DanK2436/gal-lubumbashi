import { uploadFile, getFileUrl } from './supabase-service.js';

/**
 * Vérifie si un fichier est une image
 */
function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

/**
 * Vérifie si un fichier est une vidéo
 */
function isVideoFile(filename) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

/**
 * Vérifie si une chaîne est une URL locale (commence par /public/ ou http://localhost)
 * ou un fichier local simple
 */
function isLocalFile(url) {
    return url.startsWith('/public/') || url.startsWith('public/') || !url.startsWith('http');
}

/**
 * Crée le HTML du sélecteur de médias
 */
export function createMediaPicker(options = {}) {
    const {
        fieldId = 'media-url',
        fieldLabel = 'URL du média',
        mediaType = 'all', // 'image', 'video', ou 'all'
        required = true,
        placeholder = 'https://...',
        currentValue = ''
    } = options;

    // Déterminer le mode initial
    const isLocal = currentValue && isLocalFile(currentValue);
    const mode = isLocal ? 'local' : 'url';

    return `
        <div class="media-picker-container" data-field-id="${fieldId}">
            <div class="form-group">
                <label>${fieldLabel}${required ? ' *' : ''}</label>
                
                <div class="media-source-selector mb-2" style="display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 0.75rem; padding: 0.5rem; background: #f9fafb; border-radius: 0.375rem; border: 1px solid #e5e7eb;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: normal;">
                        <input type="radio" name="${fieldId}_mode" value="url" ${mode === 'url' ? 'checked' : ''}>
                        Lien URL (YouTube, etc.)
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: normal;">
                        <input type="radio" name="${fieldId}_mode" value="local" ${mode === 'local' ? 'checked' : ''}>
                        Serveur
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: normal;">
                        <input type="radio" name="${fieldId}_mode" value="upload" ${mode === 'upload' ? 'checked' : ''}>
                        Depuis l'appareil (PC/Mobile)
                    </label>
                </div>

                <div class="media-input-wrapper">
                    <!-- Input principal (sert de stockage de valeur) -->
                    <div class="d-flex gap-2">
                        <input 
                            type="text" 
                            id="${fieldId}" 
                            class="form-input" 
                            placeholder="${placeholder}"
                            value="${currentValue}"
                            ${required ? 'required' : ''}
                            ${mode !== 'url' ? 'readonly' : ''}
                        >
                        <button 
                            type="button" 
                            class="btn btn--secondary btn--sm media-browse-btn" 
                            data-field-id="${fieldId}"
                            data-media-type="${mediaType}"
                            title="Parcourir les fichiers du serveur"
                            style="display: ${mode === 'local' ? 'flex' : 'none'};"
                        >
                            📁 Parcourir
                        </button>
                        
                        <div class="media-upload-wrapper" style="display: ${mode === 'upload' ? 'flex' : 'none'};">
                            <input 
                                type="file" 
                                id="${fieldId}_file" 
                                class="hidden-file-input" 
                                accept="${mediaType === 'image' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'image/*,video/*'}"
                                style="display: none;"
                            >
                            <button 
                                type="button" 
                                class="btn btn--secondary btn--sm media-upload-btn"
                                onclick="document.getElementById('${fieldId}_file').click()"
                            >
                                📤 Téléverser
                            </button>
                        </div>
                    </div>
                </div>

                <div id="${fieldId}-preview" class="media-preview" style="display: none;">
                    <img src="" alt="Aperçu" class="media-preview-image" style="max-width: 300px; max-height: 200px; margin-top: 10px; border-radius: 8px;" />
                    <video src="" controls class="media-preview-video" style="max-width: 300px; max-height: 200px; margin-top: 10px; border-radius: 8px; display: none;"></video>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialise les gestionnaires d'événements pour les sélecteurs de médias
 */
export function initMediaPickers() {
    // Gérer le changement de mode (Radio buttons)
    document.addEventListener('change', (e) => {
        if (e.target.type === 'radio' && e.target.name.endsWith('_mode')) {
            const container = e.target.closest('.media-picker-container');
            const fieldId = container.dataset.fieldId;
            const input = document.getElementById(fieldId);
            const browseBtn = container.querySelector('.media-browse-btn');
            const uploadWrapper = container.querySelector('.media-upload-wrapper');

            if (e.target.value === 'local') {
                // Mode Serveur (fichiers existants)
                input.readOnly = true;
                input.placeholder = "Cliquez sur Parcourir pour choisir";
                input.value = '';
                browseBtn.style.display = 'flex';
                uploadWrapper.style.display = 'none';
            } else if (e.target.value === 'upload') {
                // Mode Téléversement (nouveau fichier)
                input.readOnly = true;
                input.placeholder = "Cliquez sur Téléverser pour choisir un fichier";
                input.value = '';
                browseBtn.style.display = 'none';
                uploadWrapper.style.display = 'flex';
            } else {
                // Mode URL
                input.readOnly = false;
                input.placeholder = "https://...";
                input.value = '';
                browseBtn.style.display = 'none';
                uploadWrapper.style.display = 'none';
            }

            // Masquer l'aperçu car la valeur a changé (vide)
            const previewContainer = document.getElementById(`${fieldId}-preview`);
            if (previewContainer) {
                previewContainer.style.display = 'none';
            }
        }
    });

    // Gérer les clics sur les boutons "Parcourir"
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('media-browse-btn') ||
            e.target.closest('.media-browse-btn')) {

            const btn = e.target.classList.contains('media-browse-btn')
                ? e.target
                : e.target.closest('.media-browse-btn');

            const fieldId = btn.dataset.fieldId;
            const mediaType = btn.dataset.mediaType;

            await showMediaBrowser(fieldId, mediaType);
        }
    });

    // Gérer les téléversements de fichiers
    document.addEventListener('change', async (e) => {
        if (e.target.classList.contains('hidden-file-input')) {
            const file = e.target.files[0];
            if (!file) return;

            const container = e.target.closest('.media-picker-container');
            const fieldId = container.dataset.fieldId;
            const input = document.getElementById(fieldId);
            const uploadBtn = container.querySelector('.media-upload-btn');
            const originalBtnText = uploadBtn.textContent;

            try {
                // État de chargement
                uploadBtn.disabled = true;
                uploadBtn.textContent = '⌛ Téléversement...';

                // Déterminer le dossier (bucket) selon le type de média
                // On utilise un bucket unique "media" ou des sous-dossiers
                const timestamp = Date.now();
                const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

                // On met tout dans un bucket 'uploads' pour simplifier
                const bucketName = 'uploads';
                const filePath = `${fileName}`;

                // Upload vers Supabase Storage
                await uploadFile(bucketName, filePath, file);

                // Obtenir l'URL publique
                const publicUrl = getFileUrl(bucketName, filePath);

                // Mettre à jour l'input
                input.value = publicUrl;

                // Déclencher l'aperçu
                input.dispatchEvent(new Event('input', { bubbles: true }));

                alert('Fichier téléversé avec succès !');

            } catch (error) {
                console.error('Erreur téléversement:', error);
                alert('Erreur lors du téléversement du fichier : ' + error.message);
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.textContent = originalBtnText;
            }
        }
    });

    // Gérer les changements dans les champs URL pour afficher l'aperçu
    document.addEventListener('input', (e) => {
        // Vérifier si c'est un champ généré par notre picker (on peut vérifier s'il a un conteneur parent)
        const container = e.target.closest('.media-picker-container');
        if (container && e.target.id) {
            const fieldId = e.target.id;
            const previewContainer = document.getElementById(`${fieldId}-preview`);

            if (previewContainer) {
                updateMediaPreview(e.target.value, previewContainer);
            }
        }
    });

    // Initialiser les aperçus au chargement (pour les valeurs existantes)
    setTimeout(() => {
        document.querySelectorAll('.media-picker-container input[type="text"]').forEach(input => {
            if (input.value) {
                const fieldId = input.id;
                const previewContainer = document.getElementById(`${fieldId}-preview`);
                if (previewContainer) {
                    updateMediaPreview(input.value, previewContainer);
                }
            }
        });
    }, 500);
}

/**
 * Affiche le navigateur de médias
 */
async function showMediaBrowser(fieldId, mediaType) {
    const files = await getLocalMediaFiles(mediaType);

    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    modal.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <span class="close" style="float: right; cursor: pointer; font-size: 28px;">&times;</span>
            <h2 class="mb-4">Sélectionner un fichier</h2>
            
            <div class="media-browser-tabs mb-4">
                ${mediaType === 'all' || mediaType === 'image' ? `
                    <button class="btn btn--sm media-tab-btn active" data-tab="images">
                        🖼️ Images (${files.images.length})
                    </button>
                ` : ''}
                ${mediaType === 'all' || mediaType === 'video' ? `
                    <button class="btn btn--sm media-tab-btn ${mediaType === 'video' ? 'active' : ''}" data-tab="videos">
                        🎬 Vidéos (${files.videos.length})
                    </button>
                ` : ''}
            </div>

            <div class="media-browser-content">
                ${(mediaType === 'all' || mediaType === 'image') && files.images.length > 0 ? `
                    <div class="media-tab-panel" data-panel="images" style="display: ${mediaType === 'video' ? 'none' : 'grid'}; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
                        ${files.images.map(file => `
                            <div class="media-item" data-url="${file.fullUrl}" style="cursor: pointer; border: 2px solid transparent; border-radius: 8px; padding: 0.5rem; transition: all 0.2s;">
                                <img src="${file.fullUrl}" alt="${file.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;">
                                <p style="font-size: 0.75rem; margin-top: 0.5rem; text-align: center; word-break: break-all;">${file.name}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${(mediaType === 'all' || mediaType === 'video') && files.videos.length > 0 ? `
                    <div class="media-tab-panel" data-panel="videos" style="display: ${mediaType === 'image' ? 'none' : 'grid'}; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                        ${files.videos.map(file => `
                            <div class="media-item" data-url="${file.fullUrl}" style="cursor: pointer; border: 2px solid transparent; border-radius: 8px; padding: 0.5rem; transition: all 0.2s;">
                                <video src="${file.fullUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;" preload="metadata"></video>
                                <p style="font-size: 0.75rem; margin-top: 0.5rem; text-align: center; word-break: break-all;">${file.name}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            ${files.images.length === 0 && files.videos.length === 0 ? `
                <div class="text-center text-muted p-6">
                    <p>Aucun fichier média trouvé dans les dossiers du projet.</p>
                    <small>Ajoutez des fichiers dans les dossiers /public/images/ ou /public/videos/</small>
                </div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(modal);

    // Gérer la fermeture
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };

    // Gérer les onglets
    modal.querySelectorAll('.media-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Activer l'onglet
            modal.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Afficher le bon panneau
            modal.querySelectorAll('.media-tab-panel').forEach(panel => {
                panel.style.display = panel.dataset.panel === tab ? 'grid' : 'none';
            });
        });
    });

    // Gérer la sélection de fichiers
    modal.querySelectorAll('.media-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            const inputField = document.getElementById(fieldId);

            if (inputField) {
                inputField.value = url;
                // Déclencher l'événement input pour mettre à jour l'aperçu
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
            }

            modal.remove();
        });

        // Ajouter un effet hover
        item.addEventListener('mouseenter', () => {
            item.style.borderColor = '#dc2626';
            item.style.transform = 'scale(1.05)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.borderColor = 'transparent';
            item.style.transform = 'scale(1)';
        });
    });
}

/**
 * Met à jour l'aperçu du média
 */
function updateMediaPreview(url, previewContainer) {
    if (!url) {
        previewContainer.style.display = 'none';
        return;
    }

    const img = previewContainer.querySelector('.media-preview-image');
    const video = previewContainer.querySelector('.media-preview-video');

    if (isImageFile(url)) {
        img.src = url;
        img.style.display = 'block';
        video.style.display = 'none';
        previewContainer.style.display = 'block';
    } else if (isVideoFile(url) || url.includes('youtube.com') || url.includes('vimeo.com')) {
        video.src = url;
        video.style.display = 'block';
        img.style.display = 'none';
        previewContainer.style.display = 'block';
    } else {
        // URL externe, essayer de l'afficher comme image
        img.src = url;
        img.style.display = 'block';
        video.style.display = 'none';
        previewContainer.style.display = 'block';

        // En cas d'erreur de chargement, masquer l'aperçu
        img.onerror = () => {
            previewContainer.style.display = 'none';
        };
    }
}

/**
 * Obtient l'URL sélectionnée pour un champ
 */
export function getMediaValue(fieldId) {
    const inputField = document.getElementById(fieldId);
    return inputField ? inputField.value : '';
}

/**
 * Récupère la liste des fichiers médias locaux depuis le fichier JSON
 */
async function getLocalMediaFiles(type = 'all') {
    try {
        const response = await fetch('/data/media-index.json');
        if (!response.ok) throw new Error('Erreur chargement index média');

        const data = await response.json();

        // Fonction pour aplatir les catégories
        const flatten = (categoryObj) => {
            let files = [];
            // Si c'est déjà un tableau (ancienne structure ou erreur)
            if (Array.isArray(categoryObj)) {
                return categoryObj.map(url => ({ name: url.split('/').pop(), fullUrl: url }));
            }

            // Parcourir les catégories
            for (const category in categoryObj) {
                if (Array.isArray(categoryObj[category])) {
                    files = files.concat(categoryObj[category].map(url => ({
                        name: url.split('/').pop(),
                        fullUrl: url,
                        category: category
                    })));
                }
            }
            return files;
        };

        const images = flatten(data.images || {});
        const videos = flatten(data.videos || {});

        if (type === 'image') {
            return { images: images, videos: [] };
        } else if (type === 'video') {
            return { images: [], videos: videos };
        } else {
            return { images: images, videos: videos };
        }
    } catch (error) {
        console.error('Erreur:', error);
        return { images: [], videos: [] };
    }
}
