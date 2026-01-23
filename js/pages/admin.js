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
import { initMediaPickers } from '../media-picker.js';
import { sanitizeHTML } from '../ui.js';

let dashboardChartInstance = null;

/**
 * Check authentication
 */
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

/**
 * Main page loader
 */
async function loadPage(page) {
    const main = document.getElementById('admin-main');
    if (!main) return;

    // Update Sidebar Active State
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + page) {
            link.classList.add('active');
        }
    });

    // Update Breadcrumb
    const pageName = document.querySelector(`.nav-link[href="#${page}"] span:last-child`)?.textContent || 'Tableau de bord';
    const breadcrumbEl = document.getElementById('breadcrumb-current');
    if (breadcrumbEl) breadcrumbEl.textContent = pageName;

    // Show loading state with skeleton
    main.innerHTML = getSkeletonLoader();

    try {
        // Destroy chart instance if leaving dashboard
        if (dashboardChartInstance && page !== 'dashboard') {
            dashboardChartInstance.destroy();
            dashboardChartInstance = null;
        }

        switch (page) {
            case 'dashboard':
                main.innerHTML = await renderDashboard();
                initDashboardHandlers();
                initDashboardChart(); // Initialize chart
                break;
            case 'videos':
                main.innerHTML = await loadVideosManager();
                initMainFormHandlers();
                break;
            case 'formations':
                main.innerHTML = await loadFormationsManager();
                initMainFormHandlers();
                break;
            case 'machines':
                main.innerHTML = await loadMachinesManager();
                initMainFormHandlers();
                break;
            case 'reservations':
                main.innerHTML = await loadReservationsManager();
                break;
            case 'inscriptions-formations':
                main.innerHTML = await loadFormationRegistrationsManager();
                break;
            case 'blog':
                main.innerHTML = await loadBlogManager();
                initMainFormHandlers();
                break;
            case 'newsletter':
                main.innerHTML = await renderNewsletter();
                break;
            case 'contacts':
                main.innerHTML = await renderContacts();
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
            default:
                main.innerHTML = await renderDashboard();
                initDashboardHandlers();
                initDashboardChart();
        }
    } catch (error) {
        console.error(`Error loading page ${page}:`, error);
        main.innerHTML = renderErrorState(error.message);
    }
}

function getSkeletonLoader() {
    return `
        <div class="animate-pulse space-y-4 p-4">
            <div class="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="h-32 bg-gray-200 rounded-xl"></div>
                <div class="h-32 bg-gray-200 rounded-xl"></div>
                <div class="h-32 bg-gray-200 rounded-xl"></div>
                <div class="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div class="h-64 bg-gray-200 rounded-xl w-full"></div>
        </div>
    `;
}

/**
 * Dashboard Renderer (Premium Version)
 */
async function renderDashboard() {
    const [videos, formations, machines, posts, subscribers, contacts, reservations, registrations] = await Promise.all([
        getVideos(), getFormations(), getMachines(), getBlogPosts(),
        getNewsletterSubscribers(), getContacts(), getReservations(), getFormationRegistrations()
    ]);

    const pendingReservations = reservations.filter(r => r.status === 'En attente').length;
    const pendingRegistrations = registrations.filter(r => r.status === 'En attente').length;
    const totalContent = videos.length + formations.length + machines.length + posts.length;

    // Attach data to window for chart initialization
    window.dashboardData = {
        labels: ['Vidéos', 'Formations', 'Machines', 'Articles'],
        data: [videos.length, formations.length, machines.length, posts.length]
    };

    return `
        <div class="page-header flex justify-between items-end">
            <div>
                <h1 class="page-title">Vue d'ensemble</h1>
                <p class="page-subtitle">Monitoring et statistiques de la plateforme GAL.</p>
            </div>
            <div class="text-right hidden md:block">
                <div class="text-sm font-semibold text-muted">Aujourd'hui</div>
                <div class="text-xl font-bold text-primary">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
        </div>

        <!-- Stats Cards Row -->
        <div class="stats-grid">
            ${renderStatCard('ri-movie-2-line', videos.length, 'Vidéos en ligne', 'stat-icon--primary', '+2 cette semaine')}
            ${renderStatCard('ri-graduation-cap-line', formations.length, 'Formations actives', 'stat-icon--success', 'Certification reconnue')}
            ${renderStatCard('ri-settings-4-line', machines.length, 'Machines catalogue', 'stat-icon--warning', 'Disponibles')}
            ${renderStatCard('ri-article-line', posts.length, 'Articles publiés', 'stat-icon--info', 'Blog éducatif')}
        </div>

        <!-- Main Dashboard Content Grid -->
        <div class="dashboard-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
            
            <!-- Chart Section -->
            <div class="admin-card">
                <div class="card-header">
                    <h2 class="card-title">Répartition du Contenu</h2>
                    <select class="admin-form-select" style="width: auto; padding: 0.25rem 2rem 0.25rem 0.75rem;">
                        <option>Cette année</option>
                        <option>Ce mois</option>
                    </select>
                </div>
                <div style="height: 300px; position: relative;">
                    <canvas id="contentChart"></canvas>
                </div>
            </div>

            <!-- Activity Feed / Actions -->
            <div class="flex flex-col gap-6">
                <!-- Notifications Panel -->
                <div class="admin-card flex-1">
                    <div class="card-header">
                        <h2 class="card-title">À traiter</h2>
                    </div>
                    
                    <div class="activity-list space-y-4">
                        ${pendingRegistrations > 0 ? `
                            <div class="activity-item p-3 rounded-lg bg-orange-50 border border-orange-100 flex items-start gap-3">
                                <i class="ri-alert-line text-orange-500 mt-1"></i>
                                <div>
                                    <div class="font-bold text-orange-800">${pendingRegistrations} Inscription(s)</div>
                                    <div class="text-sm text-orange-600 mb-2">En attente de validation</div>
                                    <button class="admin-btn admin-btn--outline btn-xs bg-white" data-action="inscriptions-formations">Gérer</button>
                                </div>
                            </div>
                        ` : ''}

                        ${pendingReservations > 0 ? `
                            <div class="activity-item p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
                                <i class="ri-calendar-event-line text-blue-500 mt-1"></i>
                                <div>
                                    <div class="font-bold text-blue-800">${pendingReservations} Réservation(s)</div>
                                    <div class="text-sm text-blue-600 mb-2">Machines demandées</div>
                                    <button class="admin-btn admin-btn--outline btn-xs bg-white" data-action="reservations">Gérer</button>
                                </div>
                            </div>
                        ` : ''}

                        ${pendingRegistrations === 0 && pendingReservations === 0 ? `
                            <div class="text-center py-8 text-muted">
                                <i class="ri-check-double-line text-4xl text-green-500 mb-2 block"></i>
                                Tout est à jour !
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="admin-card">
                    <h2 class="card-title mb-4">Actions Rapides</h2>
                    <div class="grid grid-cols-2 gap-3">
                        <button class="admin-btn admin-btn--primary w-full justify-center text-sm" data-action="videos"><i class="ri-add-line"></i> Vidéo</button>
                        <button class="admin-btn admin-btn--primary w-full justify-center text-sm" data-action="formations"><i class="ri-add-line"></i> Formation</button>
                        <button class="admin-btn admin-btn--primary w-full justify-center text-sm" data-action="machines"><i class="ri-add-line"></i> Machine</button>
                        <button class="admin-btn admin-btn--primary w-full justify-center text-sm" data-action="blog"><i class="ri-add-line"></i> Article</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Secondary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="admin-card">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-muted text-sm uppercase tracking-wider font-bold">Audience Newsletter</div>
                        <div class="text-3xl font-bold mt-1">${subscribers.length}</div>
                    </div>
                    <div class="p-3 bg-indigo-50 rounded-full text-indigo-600">
                        <i class="ri-mail-send-line text-2xl"></i>
                    </div>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div class="bg-indigo-600 h-2 rounded-full" style="width: 70%"></div>
                </div>
                <div class="text-xs text-muted flex justify-between">
                    <span>Taux d'ouverture est.</span>
                    <span class="font-bold">~ 24%</span>
                </div>
                <button class="admin-btn admin-btn--outline w-full justify-center mt-4" data-action="newsletter">
                    Voir les abonnés
                </button>
            </div>
            
            <div class="admin-card">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-muted text-sm uppercase tracking-wider font-bold">Messages Contact</div>
                        <div class="text-3xl font-bold mt-1">${contacts.length}</div>
                    </div>
                    <div class="p-3 bg-pink-50 rounded-full text-pink-600">
                        <i class="ri-message-3-line text-2xl"></i>
                    </div>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div class="bg-pink-600 h-2 rounded-full" style="width: ${Math.min(contacts.length * 2, 100)}%"></div>
                </div>
                <div class="text-xs text-muted flex justify-between">
                    <span>Dernier message</span>
                    <span class="font-bold">Aujourd'hui</span>
                </div>
                <button class="admin-btn admin-btn--outline w-full justify-center mt-4" data-action="contacts">
                    Messagerie
                </button>
            </div>
        </div>
    `;
}

/**
 * Initialize Chart.js
 */
function initDashboardChart() {
    const canvas = document.getElementById('contentChart');
    if (!canvas || !window.dashboardData || !window.Chart) return;

    const ctx = canvas.getContext('2d');

    // Custom Chart.js Design
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748b';

    dashboardChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: window.dashboardData.labels,
            datasets: [{
                label: 'Nombre d\'éléments',
                data: window.dashboardData.data,
                backgroundColor: [
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderRadius: 8,
                barThickness: 40,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

function renderStatCard(iconClass, value, label, colorClass, footerText) {
    return `
        <div class="stat-card">
            <div class="stat-icon ${colorClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="stat-content w-full">
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
                ${footerText ? `<div class="mt-2 text-xs text-muted flex items-center gap-1"><i class="ri-arrow-up-line text-success"></i> ${footerText}</div>` : ''}
            </div>
        </div>
    `;
}

/**
 * Newsletter Renderer
 */
async function renderNewsletter() {
    const subscribers = await getNewsletterSubscribers();
    return `
        <div class="page-header">
            <h1 class="page-title">Newsletter</h1>
            <p class="page-subtitle">Gérez la liste des abonnés à votre lettre d'information.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Abonnés (${subscribers.length})</h2>
                <button class="admin-btn admin-btn--outline btn-sm"><i class="ri-download-line"></i> Exporter CSV</button>
            </div>

            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Date d'inscription</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subscribers.length > 0 ? subscribers.map(sub => `
                            <tr>
                                <td class="font-medium">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <i class="ri-user-line"></i>
                                        </div>
                                        ${sanitizeHTML(sub.email)}
                                    </div>
                                </td>
                                <td class="text-muted">${new Date(sub.dateSubscribed || sub.created_at).toLocaleDateString('fr-FR')}</td>
                                <td><span class="badge badge--success">Actif</span></td>
                            </tr>
                        `).join('') : `
                            <tr><td colspan="3" class="text-center p-12 text-muted">Aucun abonné pour le moment.</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Contacts Renderer
 */
async function renderContacts() {
    const contacts = await getContacts();
    return `
        <div class="page-header">
            <h1 class="page-title">Messagerie de Contact</h1>
            <p class="page-subtitle">Consultez et répondez aux messages du site web.</p>
        </div>

        <div class="admin-card">
            <div class="card-header">
                <h2 class="card-title">Boîte de réception (${contacts.length})</h2>
            </div>

            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Expéditeur</th>
                            <th>Sujet</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contacts.length > 0 ? contacts.map(contact => `
                            <tr>
                                <td>
                                    <div class="font-bold text-dark">${sanitizeHTML(contact.name)}</div>
                                    <div class="text-muted text-xs">${sanitizeHTML(contact.email)}</div>
                                </td>
                                <td><span class="badge badge--info">${sanitizeHTML(contact.subject || 'Sans sujet')}</span></td>
                                <td class="text-muted text-xs">${new Date(contact.date || contact.created_at).toLocaleDateString('fr-FR')}</td>
                                <td>
                                    <button class="admin-btn admin-btn--outline btn-sm" onclick="viewContactMessage('${contact.id}')"><i class="ri-eye-line"></i> Lire</button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr><td colspan="4" class="text-center p-12 text-muted">Aucun message pour le moment.</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Contact Modal -->
        <div id="contact-modal" class="admin-modal">
            <div class="admin-modal-content max-w-lg">
                <div class="modal-header">
                    <h2 class="modal-title">Détails du Message</h2>
                    <button class="modal-close" onclick="closeContactModal()"><i class="ri-close-line"></i></button>
                </div>
                <div id="contact-details" class="p-0"></div>
            </div>
        </div>
    `;
}

function renderErrorState(message) {
    return `
        <div class="text-center p-12 flex flex-col items-center justify-center h-full">
            <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <i class="ri-error-warning-line text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-800">Erreur de chargement</h3>
            <p class="text-gray-500 mb-6 max-w-md">${message}</p>
            <button onclick="window.location.reload()" class="admin-btn admin-btn--primary">
                <i class="ri-refresh-line"></i> Réessayer
            </button>
        </div>
    `;
}

/**
 * Handlers Initializers
 */
function initDashboardHandlers() {
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const link = document.querySelector(`.nav-link[href="#${action}"]`);
            if (link) {
                link.click();
            } else {
                window.location.hash = action;
            }
        });
    });
}

function initMainFormHandlers() {
    // Forms are handled by specific modules now
}

/**
 * Global Window Functions (for HTML onclicks)
 */
window.viewContactMessage = async (contactId) => {
    const contacts = await getContacts();
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const detailsDiv = document.getElementById('contact-details');
    detailsDiv.innerHTML = `
        <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-gray-100">
                            <span class="font-bold text-lg">${sanitizeHTML(contact.name.charAt(0))}</span>
                        </div>
                        <div>
                            <div class="font-bold text-gray-900">${sanitizeHTML(contact.name)}</div>
                            <div class="text-sm text-primary cursor-pointer hover:underline">${sanitizeHTML(contact.email)}</div>
                        </div>
                    </div>
                    <div class="text-xs text-muted bg-white px-2 py-1 rounded border border-gray-100">
                        ${new Date(contact.date || contact.created_at).toLocaleString('fr-FR')}
                    </div>
                </div>
                
                <div class="mb-2">
                    <span class="text-xs font-bold text-muted uppercase tracking-wider">Sujet</span>
                    <div class="font-medium text-gray-900">${sanitizeHTML(contact.subject || 'Sans sujet')}</div>
                </div>
            </div>

            <div>
                <span class="text-xs font-bold text-muted uppercase tracking-wider block mb-2">Message</span>
                <div class="p-4 rounded-xl border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed bg-white">
                    ${sanitizeHTML(contact.message)}
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button class="admin-btn admin-btn--outline" onclick="closeContactModal()">Fermer</button>
                <a href="mailto:${contact.email}?subject=RE: ${encodeURIComponent(contact.subject || '')}" class="admin-btn admin-btn--primary">
                    <i class="ri-reply-line"></i> Répondre
                </a>
            </div>
        </div>
    `;
    document.getElementById('contact-modal').classList.add('active');
};

window.closeContactModal = () => {
    document.getElementById('contact-modal').classList.remove('active');
};

/**
 * Initialization
 */
export async function init() {
    try {
        if (!await checkAuth()) return;

        // Initialize storage
        await initStorage();

        // Handle navigation
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveLink = (hash) => {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === hash);
            });
        };

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
        await loadPage(hash.substring(1));

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', async () => {
            await logout();
            window.location.href = 'login.html';
        });

        // Global exposing for onclicks
        window.adminModule = {
            showVideoForm, editVideo: showVideoForm, deleteVideo: deleteVideoItem,
            showFormationForm, editFormation: showFormationForm, deleteFormation: deleteFormationItem,
            showMachineForm, editMachine: showMachineForm, deleteMachine: deleteMachineItem,
            showBlogForm, editBlogPost: showBlogForm, deleteBlogPost: deleteBlogPostItem,
            deleteReservation: deleteReservationItem, confirmReservation: confirmReservationItem,
            deleteFormationRegistration: deleteFormationRegistrationItem, confirmFormationRegistration: confirmFormationRegistrationItem,
            closeModal
        };

        // Init media pickers if any
        initMediaPickers();

    } catch (error) {
        console.error('Critical Admin Error:', error);
        const main = document.getElementById('admin-main');
        if (main) main.innerHTML = renderErrorState(error.message);
    }
}
