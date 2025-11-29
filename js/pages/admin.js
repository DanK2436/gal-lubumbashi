import { getSession, logout, getVideos, getFormations, getMachines, getBlogPosts, getNewsletterSubscribers, getContacts, initStorage } from '../storage.js';
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

// Check auth
async function checkAuth() {
    const session = await getSession();
    if (!session) {
        window.location.href = '/admin/login.html';
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
            main.innerHTML = loadMembresManager('members');
            initMemberFormHandlers();
            break;
        case 'messages':
            main.innerHTML = loadMembresManager('messages');
            initMemberFormHandlers();
            break;
        case 'annonces':
            main.innerHTML = loadMembresManager('annonces');
            initMemberFormHandlers();
            break;
        case 'chantiers':
            main.innerHTML = loadProjectsManager('chantiers');
            initProjectFormHandlers();
            break;
        case 'conceptions':
            main.innerHTML = loadProjectsManager('conceptions');
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

    // Import reservations and registrations
    const { getReservations, getFormationRegistrations } = await import('../storage.js');
    const reservations = await getReservations();
    const registrations = await getFormationRegistrations();

    return `
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">📊 Dashboard</h1>
            <p class="text-gray-600">Vue d'ensemble de votre plateforme GAL</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon--primary">🎬</div>
                <div class="stat-content">
                    <div class="stat-value">${videos.length}</div>
                    <div class="stat-label">Vidéos</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-icon--success">📚</div>
                <div class="stat-content">
                    <div class="stat-value">${formations.length}</div>
                    <div class="stat-label">Formations</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-icon--warning">🛠️</div>
                <div class="stat-content">
                    <div class="stat-value">${machines.length}</div>
                    <div class="stat-label">Machines</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-icon--info">📝</div>
                <div class="stat-content">
                    <div class="stat-value">${posts.length}</div>
                    <div class="stat-label">Articles</div>
                </div>
            </div>
        </div>

        <div class="grid grid--2 gap-6 mb-6">
            <div class="admin-card">
                <div class="d-flex justify-between align-center mb-4">
                    <h2 class="text-lg font-bold">🎓 Inscriptions Formations</h2>
                    <a href="#inscriptions-formations" class="text-primary hover:underline text-sm">Voir tout →</a>
                </div>
                <div class="stat-value text-red-700">${registrations.length}</div>
                <p class="text-muted mt-2">${registrations.filter(r => r.status === 'En attente').length} en attente de confirmation</p>
                <div class="mt-4">
                    <button class="btn btn--sm btn--primary" data-action="inscriptions-formations">
                        Gérer les inscriptions
                    </button>
                </div>
            </div>

            <div class="admin-card">
                <div class="d-flex justify-between align-center mb-4">
                    <h2 class="text-lg font-bold">📅 Réservations Machines</h2>
                    <a href="#reservations" class="text-primary hover:underline text-sm">Voir tout →</a>
                </div>
                <div class="stat-value text-red-700">${reservations.length}</div>
                <p class="text-muted mt-2">${reservations.filter(r => r.status === 'En attente').length} en attente de confirmation</p>
                <div class="mt-4">
                    <button class="btn btn--sm btn--primary" data-action="reservations">
                        Gérer les réservations
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid--2 gap-6 mb-6">
            <div class="admin-card">
                <h2 class="text-lg font-bold mb-4">📧 Abonnés Newsletter</h2>
                <div class="stat-value">${subscribers.length}</div>
                <p class="text-muted mt-2">Personnes inscrites</p>
                <div class="mt-4">
                    <button class="btn btn--sm btn--outline" data-action="newsletter">
                        Voir les abonnés
                    </button>
                </div>
            </div>
            
            <div class="admin-card">
                <h2 class="text-lg font-bold mb-4">✉️ Messages de Contact</h2>
                <div class="stat-value">${contacts.length}</div>
                <p class="text-muted mt-2">Messages reçus</p>
                <div class="mt-4">
                    <button class="btn btn--sm btn--outline" data-action="contacts">
                        Lire les messages
                    </button>
                </div>
            </div>
        </div>

        <div class="admin-card">
            <h2 class="text-lg font-bold mb-4">⚡ Actions rapides</h2>
            <div class="quick-actions">
                <button class="btn btn--primary" data-action="videos">
                    <span>🎬</span> Ajouter une vidéo
                </button>
                <button class="btn btn--primary" data-action="formations">
                    <span>📚</span> Ajouter une formation
                </button>
                <button class="btn btn--primary" data-action="machines">
                    <span>🛠️</span> Ajouter une machine
                </button>
                <button class="btn btn--primary" data-action="blog">
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
                <div class="admin-card">
                    <h2>Abonnés Newsletter (${subscribers.length})</h2>
                    <div class="table-responsive mt-4">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Date d'inscription</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subscribers.map(sub => `
                                    <tr>
                                        <td>${sub.email}</td>
                                        <td>${new Date(sub.dateSubscribed).toLocaleDateString('fr-FR')}</td>
                                    </tr>
                                `).join('')}
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
                <div class="admin-card">
                    <h2>Messages de Contact (${contacts.length})</h2>
                    <div class="table-responsive mt-4">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Sujet</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${contacts.map(contact => `
                                    <tr>
                                        <td>${contact.name}</td>
                                        <td>${contact.email}</td>
                                        <td>${contact.phone || 'N/A'}</td>
                                        <td>${contact.subject || 'Sans sujet'}</td>
                                        <td>${new Date(contact.date).toLocaleDateString('fr-FR')}</td>
                                        <td>
                                            <button class="btn btn--sm btn--primary" onclick="viewContactMessage('${contact.id}')">
                                                Voir le message
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modal pour afficher le message complet -->
                <div id="contact-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close" onclick="closeContactModal()">&times;</span>
                        <div id="contact-details"></div>
                    </div>
                </div>
            `;

    window.viewContactMessage = async (contactId) => {
        const contacts = await getContacts();
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        const detailsDiv = document.getElementById('contact-details');
        detailsDiv.innerHTML = `
            <h2>Détails du message</h2>
            <div class="contact-info">
                <p><strong>Nom :</strong> ${contact.name}</p>
                <p><strong>Email :</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
                <p><strong>Téléphone :</strong> <a href="tel:${contact.phone}">${contact.phone || 'N/A'}</a></p>
                <p><strong>Sujet :</strong> ${contact.subject || 'Sans sujet'}</p>
                <p><strong>Date :</strong> ${new Date(contact.date).toLocaleString('fr-FR')}</p>
                <hr>
                <p><strong>Message :</strong></p>
                <div class="message-content">${contact.message}</div>
            </div>
        `;
        document.getElementById('contact-modal').style.display = 'block';
    };

    window.closeContactModal = () => {
        document.getElementById('contact-modal').style.display = 'none';
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

        // Initial load
        const hash = window.location.hash || '#dashboard';
        updateActiveLink(hash);
        await loadPage(hash.substring(1)); // Ajouter await ici pour attraper les erreurs de loadPage

        // Logout
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await logout();
            window.location.href = '/admin/login.html';
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
