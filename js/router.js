// Router SPA with page script loading
const routes = {
    '/': { html: '/html/home.html', script: '/js/pages/home.js' },
    '/videos': { html: '/html/videos.html', script: '/js/pages/videos.js' },
    '/formations': { html: '/html/formations.html', script: '/js/pages/formations.js' },
    '/machines': { html: '/html/machines.html', script: '/js/pages/machines.js' },
    '/blog': { html: '/html/blog.html', script: '/js/pages/blog.js' },
    '/faq': { html: '/html/faq.html', script: '/js/pages/faq.js' },
    '/a-propos': { html: '/html/about.html', script: '/js/pages/about.js' },
    '/contact': { html: '/html/contact.html', script: '/js/pages/contact.js' }
};

// Load page content
async function loadPage(path) {
    const content = document.getElementById('content');
    const route = routes[path] || routes['/'];

    try {
        const response = await fetch(route.html);
        if (response.ok) {
            const html = await response.text();
            content.innerHTML = html;

            // Execute any inline scripts in the loaded content
            const scripts = content.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);
            });

            // Load page-specific JavaScript module if it exists
            if (route.script) {
                try {
                    const module = await import(route.script);
                    if (module.init && typeof module.init === 'function') {
                        await module.init();
                        console.log(`✅ Initialized ${route.script}`);
                    }
                } catch (err) {
                    console.warn(`⚠️ Page script not found or error: ${route.script}`, err);
                }
            }

            // Update active navigation link
            updateActiveLink(path);

            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            content.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold">Page non trouvée</h1></div>';
        }
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold">Erreur de chargement</h1></div>';
    }
}

// Update active navigation link
function updateActiveLink(path) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('text-red-700');
            link.classList.remove('text-gray-800');
        } else {
            link.classList.remove('text-red-700');
            link.classList.add('text-gray-800');
        }
    });
}

// Handle navigation
function navigate(path) {
    history.pushState(null, null, path);
    loadPage(path);

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.getElementById('menu-icon').classList.remove('hidden');
        document.getElementById('close-icon').classList.add('hidden');
    }
}

// Handle link clicks
// Intercept clicks on internal links to use SPA routing
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) {
        const href = link.getAttribute('href');

        // Convert direct file paths to SPA routes
        const routeMap = {
            '/html/videos.html': '/videos',
            '/html/formations.html': '/formations',
            '/html/machines.html': '/machines',
            '/html/blog.html': '/blog',
            '/html/faq.html': '/faq',
            '/html/about.html': '/a-propos',
            '/html/contact.html': '/contact',
            '/html/home.html': '/'
        };

        // If it's a mapped route or starts with '/', use SPA navigation
        if (routeMap[href] || (href.startsWith('/') && !href.startsWith('/html/'))) {
            e.preventDefault();
            const route = routeMap[href] || href;
            navigate(route);
        }
    }
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
});

// Initialize router
document.addEventListener('DOMContentLoaded', () => {
    loadPage(window.location.pathname);
});
