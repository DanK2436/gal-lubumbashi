import { getBlogPosts, saveNewsletter, initStorage } from '../storage.js';
import { showToast } from '../ui.js';
import { t } from '../i18n.js';

let allPosts = [];

// Create blog card
function createBlogCard(post) {
    const div = document.createElement('div');
    div.className = 'bg-white group hover:shadow-xl transition-shadow duration-300';

    div.innerHTML = `
        <div class="h-48 overflow-hidden">
            <img src="${post.image || 'https://picsum.photos/400/300?random=' + post.id}" alt="${post.title}"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
        </div>
        <div class="p-8">
            <div class="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">${post.category || 'Général'}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">
                ${post.title}</h3>
            <p class="text-gray-500 text-sm mb-6">${post.excerpt || ''}</p>
            <button class="inline-flex items-center text-sm font-bold uppercase text-gray-900 hover:text-red-700 transition-colors" onclick="showArticleModal('${post.id}')">
                Lire l'article
                <svg class="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    `;

    return div;
}

// Load blog posts
async function loadBlogPosts() {
    initStorage();
    const container = document.getElementById('blog-container');
    if (!container) return;

    try {
        allPosts = await getBlogPosts();
        renderBlog();
    } catch (error) {
        console.error('Erreur chargement blog:', error);
        container.innerHTML = '<div class="col-span-full text-center text-red-500 py-12">Erreur lors du chargement des articles.</div>';
    }
}

// Render blog
function renderBlog() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    if (allPosts.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">Aucun article disponible pour le moment.</div>';
        return;
    }

    container.innerHTML = '';
    allPosts.forEach(post => {
        container.appendChild(createBlogCard(post));
    });
}

export function init() {
    console.log('📝 Initializing blog page');
    loadBlogPosts();

    // Global function for article modal
    window.showArticleModal = (id) => {
        showToast('Lecture d\'article bientôt disponible', 'info');
    };

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';

            try {
                await saveNewsletter(email);
                showToast('Merci ! Vous êtes abonné à notre newsletter.', 'success');
                e.target.reset();
            } catch (error) {
                showToast('Erreur lors de l\'inscription', 'error');
            }
        });
    }
}
