<<<<<<< HEAD
// Router SPA with page script loading - GitHub Pages compatible
// Get the base path for GitHub Pages
const BASE_PATH = window.location.hostname.includes('github.io')
    ? window.location.pathname.split('/')[1]
    : '';
const basePath = BASE_PATH ? `/${BASE_PATH}` : '';

const routes = {
    '': { html: 'html/home.html', script: 'js/pages/home.js' },
    'home': { html: 'html/home.html', script: 'js/pages/home.js' },
    'videos': { html: 'html/videos.html', script: 'js/pages/videos.js' },
    'formations': { html: 'html/formations.html', script: 'js/pages/formations.js' },
    'machines': { html: 'html/machines.html', script: 'js/pages/machines.js' },
    'blog': { html: 'html/blog.html', script: 'js/pages/blog.js' },
    'faq': { html: 'html/faq.html', script: 'js/pages/faq.js' },
    'a-propos': { html: 'html/about.html', script: 'js/pages/about.js' },
    'contact': { html: 'html/contact.html', script: 'js/pages/contact.js' }
};

// Get current route from hash
function getCurrentRoute() {
    const hash = window.location.hash.replace('#', '');
    return hash || '';
}

// Load page content
async function loadPage(routeName) {
    const content = document.getElementById('content');
    if (!content) {
        console.error('Content element not found');
        return;
    }

    const route = routes[routeName] || routes[''];

    try {
        // Use relative paths for GitHub Pages compatibility
        const htmlPath = basePath ? `${basePath}/${route.html}` : route.html;
        const response = await fetch(htmlPath);

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
                    const scriptPath = basePath ? `${basePath}/${route.script}` : `./${route.script}`;
                    const module = await import(scriptPath);
                    if (module.init && typeof module.init === 'function') {
                        await module.init();
                        console.log(`✅ Initialized ${route.script}`);
                    }
                } catch (err) {
                    console.warn(`⚠️ Page script not found or error: ${route.script}`, err);
                }
            }

            // Update active navigation link
            updateActiveLink(routeName);

            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            content.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold">Page non trouvée</h1></div>';
        }
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold text-red-600">Erreur de chargement</h1><p class="text-gray-600 mt-4">Impossible de charger la page</p></div>';
    }
}

// Update active navigation link
function updateActiveLink(routeName) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        let linkRoute = '';

        // Extract route name from different href formats
        if (href && href.includes('#')) {
            linkRoute = href.split('#')[1] || 'home';
        } else if (href && href.includes('html/')) {
            const fileName = href.split('/').pop().replace('.html', '');
            linkRoute = fileName === 'home' ? '' : fileName;
            if (fileName === 'about') linkRoute = 'a-propos';
        } else if (href === 'index.html') {
            linkRoute = '';
        }

        if (linkRoute === routeName || (routeName === '' && linkRoute === 'home')) {
            link.classList.add('text-red-700');
            link.classList.remove('text-gray-800');
        } else {
            link.classList.remove('text-red-700');
            link.classList.add('text-gray-800');
        }
    });
}

// Handle navigation
function navigate(routeName) {
    window.location.hash = routeName;
}

// Handle link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) {
        const href = link.getAttribute('href');

        // Convert HTML file paths to route names
        const routeMap = {
            'html/videos.html': 'videos',
            'html/formations.html': 'formations',
            'html/machines.html': 'machines',
            'html/blog.html': 'blog',
            'html/faq.html': 'faq',
            'html/about.html': 'a-propos',
            'html/contact.html': 'contact',
            'html/home.html': '',
            'index.html': ''
        };

        // Check if it's an internal navigation link
        if (routeMap.hasOwnProperty(href)) {
            e.preventDefault();
            navigate(routeMap[href]);
        } else if (href.startsWith('#') && !href.startsWith('#/')) {
            // Already a hash link, let it work naturally
            return;
        }
    }
});

// Handle hash changes
window.addEventListener('hashchange', () => {
    const route = getCurrentRoute();
    loadPage(route);
});

// Close mobile menu after navigation
window.addEventListener('hashchange', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.getElementById('menu-icon').classList.remove('hidden');
        document.getElementById('close-icon').classList.add('hidden');
    }
});

// Initialize router
document.addEventListener('DOMContentLoaded', () => {
    const initialRoute = getCurrentRoute();
    loadPage(initialRoute);
    console.log('🚀 Router initialized for:', window.location.hostname.includes('github.io') ? 'GitHub Pages' : 'Local');
});
=======
// Router SPA with page script loading - GitHub Pages compatible
// Get the base path for GitHub Pages
const BASE_PATH = window.location.hostname.includes('github.io')
    ? window.location.pathname.split('/')[1]
    : '';
const basePath = BASE_PATH ? `/${BASE_PATH}` : '';

const routes = {
    '': { html: 'html/home.html', script: 'js/pages/home.js' },
    'home': { html: 'html/home.html', script: 'js/pages/home.js' },
    'videos': { html: 'html/videos.html', script: 'js/pages/videos.js' },
    'formations': { html: 'html/formations.html', script: 'js/pages/formations.js' },
    'machines': { html: 'html/machines.html', script: 'js/pages/machines.js' },
    'blog': { html: 'html/blog.html', script: 'js/pages/blog.js' },
    'faq': { html: 'html/faq.html', script: 'js/pages/faq.js' },
    'a-propos': { html: 'html/about.html', script: 'js/pages/about.js' },
    'contact': { html: 'html/contact.html', script: 'js/pages/contact.js' }
};

// Get current route from hash
function getCurrentRoute() {
    const hash = window.location.hash.replace('#', '');
    return hash || '';
}

// Load page content
async function loadPage(routeName) {
    const content = document.getElementById('content');
    if (!content) {
        console.error('Content element not found');
        return;
    }

    const route = routes[routeName] || routes[''];

    try {
        // Use relative paths for GitHub Pages compatibility
        const htmlPath = basePath ? `${basePath}/${route.html}` : route.html;
        const response = await fetch(htmlPath);

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
                    const scriptPath = basePath ? `${basePath}/${route.script}` : `./${route.script}`;
                    const module = await import(scriptPath);
                    if (module.init && typeof module.init === 'function') {
                        await module.init();
                        console.log(`✅ Initialized ${route.script}`);
                    }
                } catch (err) {
                    console.warn(`⚠️ Page script not found or error: ${route.script}`, err);
                }
            }

            // Update active navigation link
            updateActiveLink(routeName);

            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            content.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold">Page non trouvée</h1></div>';
        }
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold text-red-600">Erreur de chargement</h1><p class="text-gray-600 mt-4">Impossible de charger la page</p></div>';
    }
}

// Update active navigation link
function updateActiveLink(routeName) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        let linkRoute = '';

        // Extract route name from different href formats
        if (href && href.includes('#')) {
            linkRoute = href.split('#')[1] || 'home';
        } else if (href && href.includes('html/')) {
            const fileName = href.split('/').pop().replace('.html', '');
            linkRoute = fileName === 'home' ? '' : fileName;
            if (fileName === 'about') linkRoute = 'a-propos';
        } else if (href === 'index.html') {
            linkRoute = '';
        }

        if (linkRoute === routeName || (routeName === '' && linkRoute === 'home')) {
            link.classList.add('text-red-700');
            link.classList.remove('text-gray-800');
        } else {
            link.classList.remove('text-red-700');
            link.classList.add('text-gray-800');
        }
    });
}

// Handle navigation
function navigate(routeName) {
    window.location.hash = routeName;
}

// Handle link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) {
        const href = link.getAttribute('href');

        // Convert HTML file paths to route names
        const routeMap = {
            'html/videos.html': 'videos',
            'html/formations.html': 'formations',
            'html/machines.html': 'machines',
            'html/blog.html': 'blog',
            'html/faq.html': 'faq',
            'html/about.html': 'a-propos',
            'html/contact.html': 'contact',
            'html/home.html': '',
            'index.html': ''
        };

        // Check if it's an internal navigation link
        if (routeMap.hasOwnProperty(href)) {
            e.preventDefault();
            navigate(routeMap[href]);
        } else if (href.startsWith('#') && !href.startsWith('#/')) {
            // Already a hash link, let it work naturally
            return;
        }
    }
});

// Handle hash changes
window.addEventListener('hashchange', () => {
    const route = getCurrentRoute();
    loadPage(route);
});

// Close mobile menu after navigation
window.addEventListener('hashchange', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.getElementById('menu-icon').classList.remove('hidden');
        document.getElementById('close-icon').classList.add('hidden');
    }
});

// Initialize router
document.addEventListener('DOMContentLoaded', () => {
    const initialRoute = getCurrentRoute();
    loadPage(initialRoute);
    console.log('🚀 Router initialized for:', window.location.hostname.includes('github.io') ? 'GitHub Pages' : 'Local');
});
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
