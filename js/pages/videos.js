import { getVideos, initStorage } from '../storage.js';
import { showToast, sanitizeHTML } from '../ui.js';
import { initWhatsAppButtons } from '../whatsapp.js';
import { t, initI18n } from '../i18n.js';

let allVideos = [];
let activeFilter = 'all';

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url) {
    if (!url) return null;

    // Match various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]+)/,
        /youtube\.com\/v\/([^&?\/\s]+)/,
        /youtube\.com\/shorts\/([^&?\/\s]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

// Get thumbnail URL
function getYouTubeThumbnail(url, thumbnail) {
    // If custom thumbnail is provided, use it
    if (thumbnail && thumbnail.trim() !== '') {
        return thumbnail;
    }

    // Extract video ID and generate thumbnail URL for YouTube
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Default for local videos if no thumbnail provided
    return 'https://placehold.co/800x450/ef4444/ffffff?text=Video';
}

// Format duration
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Convert YouTube URL to embed URL with optimized parameters
function getYouTubeEmbedUrl(url, autoplay = false) {
    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
        console.warn('Could not extract video ID from URL:', url);
        return url;
    }

    // Use standard YouTube embed (nocookie can sometimes have more restrictions)
    let embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const params = [];
    if (autoplay) params.push('autoplay=1');

    // Optimized parameters to maximize embedding success
    params.push('rel=0');              // Don't show related videos
    params.push('modestbranding=1');   // Minimal YouTube branding
    params.push('enablejsapi=1');      // Enable JavaScript API for better control
    params.push('playsinline=1');      // Play inline on mobile

    // Only add origin if not on file protocol to avoid issues
    if (window.location.protocol !== 'file:') {
        params.push('origin=' + window.location.origin);
    }

    if (params.length > 0) {
        embedUrl += '?' + params.join('&');
    }

    return embedUrl;
}

// Create video card
function createVideoCard(video) {
    const div = document.createElement('div');
    div.className = 'group cursor-pointer';

    const safeTitle = sanitizeHTML(video.title);
    const safeCategory = sanitizeHTML(video.category || 'Général');
    const thumbnailUrl = getYouTubeThumbnail(video.url, video.thumbnail);

    div.innerHTML = `
        <div class="relative aspect-video bg-gray-900 overflow-hidden mb-4 rounded-lg shadow-lg">
            <img src="${thumbnailUrl}" alt="${safeTitle}"
                class="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                onerror="if(this.src.includes('maxresdefault')) { this.src = this.src.replace('maxresdefault', 'hqdefault'); } else { this.onerror=null; this.src='https://placehold.co/800x450/ef4444/ffffff?text=Video+Non+Disponible'; }">
            
            <!-- Play button overlay -->
            <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div class="h-20 w-20 bg-red-700/95 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all shadow-2xl">
                    <svg class="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
            </div>
            
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-bold">
                ${formatDuration(video.durationSeconds || 0)}
            </div>
            <div class="absolute top-2 left-2 bg-red-700 text-white text-xs px-3 py-1 rounded font-bold uppercase">
                ${safeCategory}
            </div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2">${safeTitle}</h3>
    `;

    // Try to open in modal first, fallback to YouTube if restricted
    div.addEventListener('click', () => openVideoModal(video));

    return div;
}

// Open video modal with intelligent fallback
function openVideoModal(video) {
    let modal = document.getElementById('video-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center px-4 opacity-0 pointer-events-none transition-opacity duration-300';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" id="modal-overlay"></div>
            <div class="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl transform scale-95 transition-transform duration-300" id="modal-content">
                <div class="aspect-video relative bg-gray-900" id="video-container">
                    <iframe id="modal-iframe" class="w-full h-full hidden" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                    <video id="modal-video" class="w-full h-full hidden" controls autoplay playsinline></video>
                    
                    <!-- Fallback message -->
                    <div id="embed-fallback" class="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8">
                        <div class="text-center">
                            <svg class="mx-auto h-20 w-20 text-red-600 mb-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            <h3 class="text-2xl font-bold text-white mb-3">Vidéo avec restrictions</h3>
                            <p class="text-gray-400 mb-6">Cette vidéo ne peut pas être lue ici.<br>Cliquez ci-dessous pour la regarder sur YouTube.</p>
                            <button id="open-youtube-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-3 mx-auto shadow-lg">
                                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                Regarder sur YouTube
                            </button>
                        </div>
                    </div>
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

        const safeCloseModal = () => {
            if (window.closeVideoModalWithCleanup) {
                window.closeVideoModalWithCleanup();
            } else {
                closeVideoModal();
            }
        };

        modal.querySelector('#modal-overlay').addEventListener('click', safeCloseModal);
        modal.querySelector('#modal-close').addEventListener('click', safeCloseModal);
    }

    const title = modal.querySelector('#modal-title');
    const desc = modal.querySelector('#modal-desc');
    const iframe = modal.querySelector('#modal-iframe');
    const fallback = modal.querySelector('#embed-fallback');
    const youtubeBtn = modal.querySelector('#open-youtube-btn');

    title.textContent = video.title;
    desc.textContent = `${video.category || 'Général'} • ${formatDuration(video.durationSeconds || 0)}`;

    // Reset state
    fallback.classList.add('hidden');
    iframe.classList.add('hidden');
    const videoPlayer = modal.querySelector('#modal-video');
    videoPlayer.classList.add('hidden');
    videoPlayer.src = '';

    const isYouTube = !!getYouTubeVideoId(video.url);

    if (isYouTube) {
        iframe.classList.remove('hidden');
        const embedUrl = getYouTubeEmbedUrl(video.url, true);
        iframe.src = embedUrl;

        // Update YouTube button
        youtubeBtn.classList.remove('hidden');
        youtubeBtn.onclick = () => {
            window.open(video.url, '_blank');
            closeVideoModal();
        };

        // Smart restriction detection using YouTube's postMessage API
        let loadTimeout = null;
        const messageHandler = (event) => {
            if (!event.origin.includes('youtube.com')) return;
        };
        window.addEventListener('message', messageHandler);

        loadTimeout = setTimeout(() => {
            console.warn('Video may have embedding restrictions:', video.title);
        }, 5000);

        iframe.onload = () => {
            if (loadTimeout) clearTimeout(loadTimeout);
        };

        const originalCloseModal = closeVideoModal;
        window.closeVideoModalWithCleanup = () => {
            window.removeEventListener('message', messageHandler);
            if (loadTimeout) clearTimeout(loadTimeout);
            originalCloseModal();
        };
    } else {
        // Local video file (.mp4, etc)
        videoPlayer.classList.remove('hidden');
        videoPlayer.src = video.url;
        youtubeBtn.classList.add('hidden');
    }

    // Handle iframe error event (rarely triggered for cross-origin content)
    iframe.onerror = () => {
        if (loadTimeout) clearTimeout(loadTimeout);
        fallback.classList.remove('hidden');
        iframe.classList.add('hidden');
    };

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
    const video = modal.querySelector('#modal-video');

    if (iframe) iframe.src = '';
    if (video) {
        video.pause();
        video.src = '';
    }

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

    const categories = [...new Set(allVideos.map(v => v.category))];

    container.innerHTML = `
        <button class="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeFilter === 'all' ? 'bg-red-700 text-white shadow-lg shadow-red-700/30' : 'bg-white text-gray-600 hover:bg-gray-100'}"
            data-filter="all">
            Tout
        </button>
    `;

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeFilter === cat ? 'bg-red-700 text-white shadow-lg shadow-red-700/30' : 'bg-white text-gray-600 hover:bg-gray-100'}`;
        btn.dataset.filter = cat;
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            activeFilter = cat;
            renderVideos();
            setupFilters();
        });
        container.appendChild(btn);
    });

    container.querySelector('[data-filter="all"]').addEventListener('click', () => {
        activeFilter = 'all';
        renderVideos();
        setupFilters();
    });
}

export function init() {
    console.log('🎥 Initializing videos page');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (window.closeVideoModalWithCleanup) {
                window.closeVideoModalWithCleanup();
            } else {
                closeVideoModal();
            }
        }
    });

    loadVideos();
}

// Auto-initialize
initI18n().then(init);
