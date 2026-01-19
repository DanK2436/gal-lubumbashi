import { getSession, logout, getVideos, getFormations, getMachines, getBlogPosts, getNewsletterSubscribers, getContacts, initStorage, getReservations, getFormationRegistrations } from '../storage.js';
import {
    loadVideosManager, loadFormationsManager, loadMachinesManager, loadBlogManager,
    saveVideo, saveFormation, saveMachine, saveBlogPost,
    showVideoForm, deleteVideoItem,
    showFormationForm, deleteFormationItem,
    showMachineForm, deleteMachineItem,
    showBlogForm, deleteBlogPostItem,
    loadReservationsManager, deleteReservationItem, confirmReservationItem,
    loadFormationRegistrationsManager, deleteFormationRegistrationItem, confirmFormationRegistrationItem,
    closeModal
} from '../admin.js';
import { loadMembresManager, initMemberFormHandlers } from './admin-membres.js';
import { loadProjectsManager, initProjectFormHandlers } from './admin-projects.js';
import { createMediaPicker, initMediaPickers, getMediaValue } from '../media-picker.js';
import { sanitizeHTML } from '../ui.js';

// Check auth
async function checkAuth() {
    const session = await getSession();
    if (!session) {
        window.location.href = 'login.html';
        return false;
    }
    const emailEl = document.getElementById('admin-email');
    if (emailEl) emailEl.textContent = session.email;
    return true;
}

// Load page
async function loadPage(page) {
    const main = document.getElementById('admin-main');

    if (!main) return;

    switch (page) {
        case 'dashboard':
            main.innerHTML = await loadDashboard();
            // Quick actions handlers
            main.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    const link = document.querySelector(`.nav-link[href="#${action}"]`);
                    if (link) link.click();
                });
            });
            break;
        case 'videos':
            main.innerHTML = await loadVideosManager();
            initFormHandlers();
            break;
        case 'formations':
            main.innerHTML = await loadFormationsManager();
            initFormHandlers();
            break;
        case 'machines':
            main.innerHTML = await loadMachinesManager();
            initFormHandlers();
            break;
        case 'reservations':
            main.innerHTML = await loadReservationsManager();
            break;
        case 'inscriptions-formations':
            main.innerHTML = await loadFormationRegistrationsManager();
            break;
        case 'blog':
            main.innerHTML = await loadBlogManager();
            initFormHandlers();
            break;
        case 'newsletter':
            await loadNewsletter();
            break;
        case 'contacts':
            await loadContacts();
            break;
        case 'membres':
            main.innerHTML = await loadMembresManager('members');
            initMemberFormHandlers();
            break;
        case 'messages':
            main.innerHTML = await loadMembresManager('messages');
            initMemberFormHandlers();
            break;
        case 'annonces':
            main.innerHTML = await loadMembresManager('annonces');
            initMemberFormHandlers();
            break;
        case 'chantiers':
            main.innerHTML = await loadProjectsManager('chantiers');
            initProjectFormHandlers();
            break;
        case 'conceptions':
            main.innerHTML = await loadProjectsManager('conceptions');
            initProjectFormHandlers();
            break;
    }
}

// Load dashboard
async function loadDashboard() {
    const videos = await getVideos();
    const formations = await getFormations();
    const machines = await getMachines();
    const posts = await getBlogPosts();
    const subscribers = await getNewsletterSubscribers();
    const contacts = await getContacts();
    const reservations = await getReservations();
    const registrations = await getFormationRegistrations();

    return `
        <div class="page-header">
            <h1 class="page-title">Tableau de bord</h1>
            <p class="page-subtitle">Bienvenue dans votre espace d'administration GAL. Voici un aperçu de l'activité.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon--primary">🎬</div>
                <div class="stat-content">
                    <div class="stat-value">${videos.length}</div>
                    <div class="stat-label">Vidéos publiées</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-icon--success">📚</div>
                <div class="stat-content">
                    <div class="stat-value">${formations.length}</div>
                    <div class="stat-label">Catalogue Formations</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-icon--warning">🛠️</div>
                <div class="stat-content">
                    <div class="stat-value">${machines.length}</div>
                    <div class="stat-label">Parc Machines</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-icon--info">📝</div>
                <div class="stat-content">
                    <div class="stat-value">${posts.length}</div>
                    <div class="stat-label">Articles Blog</div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
            <div class="admin-card">
                <div class="card-header">
                    <h2 class="card-title">🎓 Inscriptions Formations</h2>
                    <a href="#inscriptions-formations" class="admin-btn admin-btn--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Voir tout</a>
                </div>
                <div style="display: flex; align-items: baseline; gap: 1rem;">
                    <div class="stat-value" style="font-size: 2.5rem; color: var(--admin-primary);">${registrations.length}</div>
                    <div style="color: var(--admin-text-muted); font-size: 0.875rem;">Total inscriptions</div>
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: #fff7ed; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <span style="font-weight: 600; color: #9a3412;">${registrations.filter(r => r.status === 'En attente').length} en attente</span>
                    <p style="margin: 0; font-size: 0.8125rem; color: #9a3412;">Demandes nécéssitant une validation immédiate.</p>
                </div>
                <div style="margin-top: 1.5rem;">
                    <button class="admin-btn admin-btn--primary w-full" data-action="inscriptions-formations" style="justify-content: center;">
                        Gérer les inscriptions
                    </button>
                </div>
            </div>

            <div class="admin-card">
                <div class="card-header">
                    <h2 class="card-title">📅 Réservations Machines</h2>
                    <a href="#reservations" class="admin-btn admin-btn--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Voir tout</a>
                </div>
                <div style="display: flex; align-items: baseline; gap: 1rem;">
                    <div class="stat-value" style="font-size: 2.5rem; color: var(--admin-primary);">${reservations.length}</div>
                    <div style="color: var(--admin-text-muted); font-size: 0.875rem;">Total réservations</div>
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: #fff7ed; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <span style="font-weight: 600; color: #9a3412;">${reservations.filter(r => r.status === 'En attente').length} en attente</span>
                    <p style="margin: 0; font-size: 0.8125rem; color: #9a3412;">Réservations de machines à confirmer.</p>
                </div>
                <div style="margin-top: 1.5rem;">
                    <button class="admin-btn admin-btn--primary w-full" data-action="reservations" style="justify-content: center;">
                        Gérer les réservations
                    </button>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="admin-card">
                <h2 class="card-title" style="margin-bottom: 1rem;">📧 Audience Newsletter</h2>
                <div class="stat-value">${subscribers.length}</div>
                <p style="color: var(--admin-text-muted); font-size: 0.875rem;">Artisans et partenaires abonnés</p>
                <div style="margin-top: 1.5rem;">
                    <button class="admin-btn admin-btn--outline w-full" data-action="newsletter" style="justify-content: center;">
                        Exporter la liste
                    </button>
                </div>
            </div>
            
            <div class="admin-card">
                <h2 class="card-title" style="margin-bottom: 1rem;">✉️ Messages de Contact</h2>
                <div class="stat-value">${contacts.length}</div>
                <p style="color: var(--admin-text-muted); font-size: 0.875rem;">Messages reçus via le formulaire</p>
                <div style="margin-top: 1.5rem;">
                    <button class="admin-btn admin-btn--outline w-full" data-action="contacts" style="justify-content: center;">
                        Lire les messages
                    </button>
                </div>
            </div>
        </div>

        <div class="admin-card">
            <h2 class="card-title" style="margin-bottom: 1.5rem;">⚡ Actions rapides</h2>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="admin-btn admin-btn--primary" data-action="videos">
                    <span>🎬</span> Ajouter une vidéo
                </button>
                <button class="admin-btn admin-btn--primary" data-action="formations">
                    <span>📚</span> Ajouter une formation
                </button>
                <button class="admin-btn admin-btn--primary" data-action="machines">
                    <span>🛠️</span> Ajouter une machine
                </button>
                <button class="admin-btn admin-btn--primary" data-action="blog">
                    <span>📝</span> Nouvel article
                </button>
            </div>
        </div>
    `;
}

// Initialize form handlers
function initFormHandlers() {
    setTimeout(() => {
        const videoForm = document.getElementById('video-form');
        if (videoForm) {
            const newVideoForm = videoForm.cloneNode(true);
            videoForm.parentNode.replaceChild(newVideoForm, videoForm);

            newVideoForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('id', document.getElementById('video-id').value);
                formData.append('title', document.getElementById('video-title').value);
                formData.append('category', document.getElementById('video-category').value);
                formData.append('url', document.getElementById('video-url').value);
                formData.append('thumbnail', document.getElementById('video-thumbnail').value);
                formData.append('duration', document.getElementById('video-duration').value);
                await saveVideo(formData);
            });
        }

        const formationForm = document.getElementById('formation-form');
        if (formationForm) {
            const newFormationForm = formationForm.cloneNode(true);
            formationForm.parentNode.replaceChild(newFormationForm, formationForm);

            newFormationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('id', document.getElementById('formation-id').value);
                formData.append('title', document.getElementById('formation-title').value);
                formData.append('description', document.getElementById('formation-description').value);
                formData.append('level', document.getElementById('formation-level').value);
                formData.append('duration', document.getElementById('formation-duration').value);
                formData.append('price', document.getElementById('formation-price').value);
                formData.append('image', document.getElementById('formation-image').value);
                formData.append('modules', document.getElementById('formation-modules').value);
                await saveFormation(formData);
            });
        }

        const machineForm = document.getElementById('machine-form');
        if (machineForm) {
            const newMachineForm = machineForm.cloneNode(true);
            machineForm.parentNode.replaceChild(newMachineForm, machineForm);

            newMachineForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('id', document.getElementById('machine-id').value);
                formData.append('name', document.getElementById('machine-name').value);
                formData.append('category', document.getElementById('machine-category').value);
                formData.append('image', document.getElementById('machine-image').value);
                formData.append('price', document.getElementById('machine-price').value);
                formData.append('status', document.getElementById('machine-status').value);
                formData.append('specs', document.getElementById('machine-specs').value);
                await saveMachine(formData);
            });
        }

        const blogForm = document.getElementById('blog-form');
        if (blogForm) {
            const newBlogForm = blogForm.cloneNode(true);
            blogForm.parentNode.replaceChild(newBlogForm, blogForm);

            newBlogForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('id', document.getElementById('blog-id').value);
                formData.append('title', document.getElementById('blog-title').value);
                formData.append('category', document.getElementById('blog-category').value);
                formData.append('author', document.getElementById('blog-author').value);
                formData.append('excerpt', document.getElementById('blog-excerpt').value);
                formData.append('content', document.getElementById('blog-content').value);
                formData.append('image', document.getElementById('blog-image').value);
                formData.append('tags', document.getElementById('blog-tags').value);
                await saveBlogPost(formData);
            });
        }
    }, 100);
}

// Load newsletter
async function loadNewsletter() {
    const subscribers = await getNewsletterSubscribers();
    const main = document.getElementById('admin-main');
    if (!main) return;

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Newsletter</h1>
            <p class="page-subtitle">Gérez la liste des abonnés à votre lettre d'information.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Abonnés (${subscribers.length})</h2>
            </div>

            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Date d'inscription</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subscribers.map(sub => `
                            <tr>
                                <td><span style="font-weight: 500;">${sanitizeHTML(sub.email)}</span></td>
                                <td><span style="color: var(--admin-text-muted); font-size: 0.8125rem;">${new Date(sub.dateSubscribed || sub.created_at).toLocaleDateString('fr-FR')}</span></td>
                            </tr>
                        `).join('')}
                        ${subscribers.length === 0 ? `
                            <tr>
                                <td colspan="2" style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
                                    Aucun abonné pour le moment.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Load contacts
async function loadContacts() {
    const contacts = await getContacts();
    const main = document.getElementById('admin-main');
    if (!main) return;

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Messages</h1>
            <p class="page-subtitle">Consultez et répondez aux messages envoyés via le formulaire de contact.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Messages reçus (${contacts.length})</h2>
            </div>

            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Expéditeur</th>
                            <th>Contact</th>
                            <th>Sujet</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contacts.map(contact => `
                            <tr>
                                <td><span style="font-weight: 600;">${sanitizeHTML(contact.name)}</span></td>
                                <td>
                                    <div style="font-size: 0.8125rem;">${sanitizeHTML(contact.email)}</div>
                                    <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${sanitizeHTML(contact.phone || '')}</div>
                                </td>
                                <td><span class="badge badge--primary">${sanitizeHTML(contact.subject || 'Sans sujet')}</span></td>
                                <td><span style="color: var(--admin-text-muted); font-size: 0.8125rem;">${new Date(contact.date || contact.created_at).toLocaleDateString('fr-FR')}</span></td>
                                <td>
                                    <button class="admin-btn admin-btn--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="viewContactMessage('${contact.id}')">
                                        Voir
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                        ${contacts.length === 0 ? `
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
                                    Aucun message pour le moment.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal pour afficher le message complet -->
        <div id="contact-modal" class="admin-modal">
            <div class="admin-modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2 class="modal-title">Détails du Message</h2>
                    <button class="modal-close" onclick="closeContactModal()">&times;</button>
                </div>
                <div id="contact-details" style="padding: 1.5rem;"></div>
            </div>
        </div>
    `;

    window.viewContactMessage = async (contactId) => {
        const contacts = await getContacts();
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        const detailsDiv = document.getElementById('contact-details');
        detailsDiv.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <span style="color: var(--admin-text-muted);">Nom:</span>
                    <span style="font-weight: 600;">${sanitizeHTML(contact.name)}</span>
                    
                    <span style="color: var(--admin-text-muted);">Email:</span>
                    <a href="mailto:${sanitizeHTML(contact.email)}" style="color: var(--admin-primary);">${sanitizeHTML(contact.email)}</a>
                    
                    <span style="color: var(--admin-text-muted);">Tél:</span>
                    <span>${sanitizeHTML(contact.phone || 'N/A')}</span>
                    
                    <span style="color: var(--admin-text-muted);">Sujet:</span>
                    <span style="font-weight: 600;">${sanitizeHTML(contact.subject || 'Sans sujet')}</span>
                    
                    <span style="color: var(--admin-text-muted);">Date:</span>
                    <span>${new Date(contact.date || contact.created_at).toLocaleString('fr-FR')}</span>
                </div>
                
                <div style="border-top: 1px solid var(--admin-border); padding-top: 1rem;">
                    <p style="color: var(--admin-text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Message</p>
                    <div style="line-height: 1.6; color: var(--admin-text); background: var(--admin-bg-alt); padding: 1rem; border-radius: 0.5rem; white-space: pre-wrap;">${sanitizeHTML(contact.message)}</div>
                </div>
                
                <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                    <a href="mailto:${sanitizeHTML(contact.email)}?subject=RE: ${encodeURIComponent(contact.subject || '')}" class="admin-btn admin-btn--primary">
                        Répondre par email
                    </a>
                </div>
            </div>
        `;
        document.getElementById('contact-modal').classList.add('active');
    };

    window.closeContactModal = () => {
        document.getElementById('contact-modal').classList.remove('active');
    };
}

// Initialize
export async function init() {
    try {
        if (!await checkAuth()) return;

        // Initialize storage - charge les données JSON dans localStorage
        await initStorage();

        // Handle navigation
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveLink(hash) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const hash = link.getAttribute('href');
                window.location.hash = hash;
                updateActiveLink(hash);
                loadPage(hash.substring(1));
            });
        });

        // Initial load with timeout
        const hash = window.location.hash || '#dashboard';
        updateActiveLink(hash);

        console.log('Chargement de la page admin:', hash);

        // Timeout de sécurité pour le chargement
        const loadPromise = loadPage(hash.substring(1));
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Le chargement prend trop de temps (timeout 10s)')), 10000)
        );

        try {
            await Promise.race([loadPromise, timeoutPromise]);
            console.log('Page chargée avec succès');
        } catch (err) {
            console.error('Erreur chargement page:', err);
            const main = document.getElementById('admin-main');
            if (main) {
                main.innerHTML = `
                    <div class="text-center p-8 text-red-600">
                        <h3 class="text-xl font-bold mb-2">Erreur de chargement</h3>
                        <p>${err.message}</p>
                        <button onclick="window.location.reload()" class="mt-4 btn btn--primary">Réessayer</button>
                    </div>
                `;
            }
        }

        // Logout
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await logout();
            window.location.href = 'login.html';
        });

        // Expose admin module functions globally for onclick handlers
        window.adminModule = {
            showVideoForm,
            editVideo: showVideoForm,
            deleteVideo: deleteVideoItem,

            showFormationForm,
            editFormation: showFormationForm,
            deleteFormation: deleteFormationItem,

            showMachineForm,
            editMachine: showMachineForm,
            deleteMachine: deleteMachineItem,

            showBlogForm,
            editBlogPost: showBlogForm,
            deleteBlogPost: deleteBlogPostItem,

            showBlogForm,
            editBlogPost: showBlogForm,
            deleteBlogPost: deleteBlogPostItem,

            deleteReservation: deleteReservationItem,
            confirmReservation: confirmReservationItem,

            deleteFormationRegistration: deleteFormationRegistrationItem,
            confirmFormationRegistration: confirmFormationRegistrationItem,

            closeModal
        };

        // Initialiser les sélecteurs de médias
        initMediaPickers();

    } catch (error) {
        console.error('Erreur critique admin:', error);
        const main = document.getElementById('admin-main');
        if (main) {
            main.innerHTML = `
                <div class="text-center p-20" style="color: #dc2626;">
                    <h3>Une erreur est survenue lors du chargement</h3>
                    <p>Veuillez rafraîchir la page ou contacter le support.</p>
                    <pre style="background: #f3f4f6; padding: 1rem; margin-top: 1rem; border-radius: 0.5rem; text-align: left; overflow: auto;">${error.message}\n${error.stack}</pre>
                </div>
            `;
        }
    }
}
