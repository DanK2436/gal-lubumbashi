import { getVideos, initStorage } from '../storage.js';
import { showToast } from '../ui.js';
import { initWhatsAppButtons } from '../whatsapp.js';
import { t, initI18n } from '../i18n.js';

let allVideos = [];
let activeFilter = 'all';

// Format duration
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Create video card
function createVideoCard(video) {
    const div = document.createElement('div');
    div.className = 'group cursor-pointer';

    div.innerHTML = `
        <div class="relative aspect-video bg-gray-900 overflow-hidden mb-4">
            <img src="${video.thumbnail || 'https://picsum.photos/800/450?random=' + video.id}" alt="${video.title}"
                class="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="h-16 w-16 bg-red-700/90 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <svg class="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
            </div>
            <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                ${formatDuration(video.durationSeconds)}
            </div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">${video.title}</h3>
        <p class="text-gray-500 text-sm mt-2">${video.category || 'Général'}</p>
    `;

    // Add click handler
    div.addEventListener('click', () => openVideoModal(video));

    return div;
}

// Open video modal
function openVideoModal(video) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('video-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center px-4 opacity-0 pointer-events-none transition-opacity duration-300';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" id="modal-overlay"></div>
            <div class="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl transform scale-95 transition-transform duration-300" id="modal-content">
                <div class="aspect-video relative">
                    <iframe id="modal-iframe" class="w-full h-full" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                </div>
                <div class="p-6 bg-gray-900">
                    <div class="flex justify-between items-start gap-4">
                        <div>
                            <h3 class="text-2xl font-bold text-white mb-2" id="modal-title"></h3>
                            <p class="text-gray-400" id="modal-desc"></p>
                        </div>
                        <button class="text-gray-400 hover:text-white transition-colors" id="modal-close">
                            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#modal-overlay').addEventListener('click', closeVideoModal);
        modal.querySelector('#modal-close').addEventListener('click', closeVideoModal);
    }

    const title = modal.querySelector('#modal-title');
    const desc = modal.querySelector('#modal-desc');
    const iframe = modal.querySelector('#modal-iframe');

    title.textContent = video.title;
    desc.textContent = `${video.category} • ${formatDuration(video.durationSeconds)}`;

    // Handle URL (convert to embed if needed, simple check)
    let embedUrl = video.url;
    if (video.url.includes('youtube.com/watch?v=')) {
        embedUrl = video.url.replace('watch?v=', 'embed/');
        embedUrl += '?autoplay=1';
    } else if (video.url.includes('youtu.be/')) {
        embedUrl = video.url.replace('youtu.be/', 'www.youtube.com/embed/');
        embedUrl += '?autoplay=1';
    }

    iframe.src = embedUrl;

    // Show modal
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('#modal-content').classList.remove('scale-95');
    modal.querySelector('#modal-content').classList.add('scale-100');
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    const iframe = modal.querySelector('#modal-iframe');
    if (iframe) iframe.src = ''; // Stop video

    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('#modal-content').classList.add('scale-95');
    modal.querySelector('#modal-content').classList.remove('scale-100');
}

// Load videos
async function loadVideos() {
    initStorage();
    const container = document.getElementById('videos-container');
    if (!container) return;

    try {
        allVideos = await getVideos();
        renderVideos();
        setupFilters();
    } catch (error) {
        console.error('Erreur chargement vidéos:', error);
        container.innerHTML = '<p class="col-span-full text-center text-red-500">Erreur lors du chargement des vidéos.</p>';
    }
}

// Render videos
function renderVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;

    const filtered = activeFilter === 'all'
        ? allVideos
        : allVideos.filter(v => v.category === activeFilter);

    if (filtered.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-500">Aucune vidéo disponible pour le moment.</p>';
        return;
    }

    container.innerHTML = '';
    filtered.forEach(video => {
        container.appendChild(createVideoCard(video));
    });
}

// Setup filters
function setupFilters() {
    const container = document.getElementById('video-filters');
    if (!container) return;

    // Extract unique categories
    const categories = [...new Set(allVideos.map(v => v.category))];

    // Clear existing buttons except "All" (if we want to keep a static "All" button, but here we rebuild)
    container.innerHTML = `
        <button class="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeFilter === 'all' ? 'bg-red-700 text-white shadow-lg shadow-red-700/30' : 'bg-white text-gray-600 hover:bg-gray-100'}"
            data-filter="all">
            Tout
        </button>
    `;

    // Add category buttons
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeFilter === cat ? 'bg-red-700 text-white shadow-lg shadow-red-700/30' : 'bg-white text-gray-600 hover:bg-gray-100'}`;
        btn.dataset.filter = cat;
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            activeFilter = cat;
            renderVideos();
            setupFilters(); // Re-render filters to update active state
        });
        container.appendChild(btn);
    });

    // Add event listener for "All"
    container.querySelector('[data-filter="all"]').addEventListener('click', () => {
        activeFilter = 'all';
        renderVideos();
        setupFilters();
    });
}

export function init() {
    console.log('🎥 Initializing videos page');

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVideoModal();
    });

    loadVideos();
}

// Auto-initialize
initI18n().then(init);
