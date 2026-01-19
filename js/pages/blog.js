<<<<<<< HEAD
import { getBlogPosts, saveNewsletter, initStorage } from '../storage.js';
import { showToast, sanitizeHTML } from '../ui.js';
import { t, initI18n } from '../i18n.js';

let allPosts = [];

/**
 * Supprime les balises HTML d'une chaîne pour l'aperçu
 */
function stripHTML(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// Create blog card
function createBlogCard(post) {
    const div = document.createElement('div');
    div.className = 'bg-white group hover:shadow-xl transition-shadow duration-300';

    const safeTitle = sanitizeHTML(post.title);

    // Déterminer l'extrait à afficher
    let excerptValue = post.excerpt || post.description || '';
    if (!excerptValue && post.content) {
        // Si l'extrait est vide, on prend les 150 premiers caractères du contenu (sans HTML)
        const plainContent = stripHTML(post.content);
        excerptValue = plainContent.substring(0, 150) + (plainContent.length > 150 ? '...' : '');
    }

    const safeExcerpt = sanitizeHTML(excerptValue);
    const safeCategory = sanitizeHTML(post.category || (post.tags && post.tags.length > 0 ? post.tags[0] : 'Général'));

    const imageSrc = post.cover || post.image || 'https://picsum.photos/400/300?random=' + post.id;

    div.innerHTML = `
        <div class="h-48 overflow-hidden">
            <img src="${imageSrc}" alt="${safeTitle}"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
        </div>
        <div class="p-8">
            <div class="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">${safeCategory}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">
                ${safeTitle}</h3>
            <p class="text-gray-500 text-sm mb-6 line-clamp-3 text-justify">${safeExcerpt || 'Découvrez la suite de cet article en cliquant ci-dessous.'}</p>
            <button class="inline-flex items-center text-sm font-bold uppercase text-gray-900 hover:text-red-700 transition-colors" onclick="window.showArticleModal('${post.id}')">
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
        const post = allPosts.find(p => p.id === id);
        if (!post) return;

        const modal = document.getElementById('article-modal');
        const title = document.getElementById('modal-title');
        const image = document.getElementById('modal-image');
        const meta = document.getElementById('modal-meta');
        const content = document.getElementById('modal-content');

        if (modal && title && image && meta && content) {
            title.textContent = post.title;
            image.src = post.cover || post.image || 'https://picsum.photos/800/400?random=' + post.id;
            meta.textContent = `Publié le ${new Date(post.date || post.created_at).toLocaleDateString('fr-FR')} | ${post.category || 'Général'}`;

            // On n'utilise pas sanitizeHTML ici car le contenu du blog contient des balises HTML
            // (p, h2, b, etc.) stockées en base ou dans le JSON.
            content.innerHTML = post.content || post.excerpt || 'Contenu non disponible.';

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    };

    window.closeArticleModal = () => {
        const modal = document.getElementById('article-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
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

// Auto-initialize
initI18n().then(init);
=======
import { getBlogPosts, saveNewsletter, initStorage } from '../storage.js';
import { showToast } from '../ui.js';
import { t, initI18n } from '../i18n.js';

let allPosts = [];

// Create blog card
function createBlogCard(post) {
    const div = document.createElement('div');
    div.className = 'bg-white group hover:shadow-xl transition-shadow duration-300';

    const imageSrc = post.cover || post.image || 'https://picsum.photos/400/300?random=' + post.id;
    const category = post.category || (post.tags && post.tags.length > 0 ? post.tags[0] : 'Général');

    div.innerHTML = `
        <div class="h-48 overflow-hidden">
            <img src="${imageSrc}" alt="${post.title}"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
        </div>
        <div class="p-8">
            <div class="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">${category}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">
                ${post.title}</h3>
            <p class="text-gray-500 text-sm mb-6 line-clamp-3">${post.excerpt || ''}</p>
            <button class="inline-flex items-center text-sm font-bold uppercase text-gray-900 hover:text-red-700 transition-colors" onclick="window.showArticleModal('${post.id}')">
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
        const post = allPosts.find(p => p.id === id);
        if (!post) return;

        const modal = document.getElementById('article-modal');
        const title = document.getElementById('modal-title');
        const image = document.getElementById('modal-image');
        const meta = document.getElementById('modal-meta');
        const content = document.getElementById('modal-content');

        if (modal && title && image && meta && content) {
            title.textContent = post.title;
            image.src = post.cover || post.image || 'https://picsum.photos/800/400?random=' + post.id;
            meta.textContent = `Publié le ${new Date(post.date).toLocaleDateString('fr-FR')} | ${post.category || 'Général'}`;
            content.innerHTML = post.content || post.excerpt || 'Contenu non disponible.';

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    };

    window.closeArticleModal = () => {
        const modal = document.getElementById('article-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
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

// Auto-initialize
initI18n().then(init);
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
