/**
 * app.js - Router SPA et initialisation
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { initStorage } from './storage.js';
import { initI18n, t, setLanguage as changeLang } from './i18n.js';
import { initSEO, setPageMeta } from './seo.js';
import { initWhatsAppButtons, createFloatingWhatsAppButton } from './whatsapp.js';
import { initAssistant } from './assistant.js';
import { initAccordion } from './ui.js';

// État de l'application
const appState = {
  currentRoute: '',
  currentPage: null
};

// Routes disponibles
const routes = {
  '': { title: 'Accueil', view: 'home', file: 'html/home.html', script: 'js/pages/home.js' },
  'home': { title: 'Accueil', view: 'home', file: 'html/home.html', script: 'js/pages/home.js' },
  'videos': { title: 'Vidéos', view: 'videos', file: 'html/videos.html', script: 'js/pages/videos.js' },
  'formations': { title: 'Formations', view: 'formations', file: 'html/formations.html', script: 'js/pages/formations.js' },
  'machines': { title: 'Machines', view: 'machines', file: 'html/machines.html', script: 'js/pages/machines.js' },
  'a-propos': { title: 'À propos', view: 'about', file: 'html/about.html', script: 'js/pages/about.js' },
  'contact': { title: 'Contact', view: 'contact', file: 'html/contact.html', script: 'js/pages/contact.js' },
  'faq': { title: 'FAQ', view: 'faq', file: 'html/faq.html', script: 'js/pages/faq.js' },
  'blog': { title: 'Blog', view: 'blog', file: 'html/blog.html', script: 'js/pages/blog.js' },
  'privacy': { title: 'Confidentialité & CGV', view: 'privacy', file: 'html/privacy.html' },
  'admin': { title: 'Administration', view: 'admin', file: 'admin/index.html' }
};

/**
 * Initialise l'application
 */
export async function initApp() {
  console.log('🚀 Initialisation de GAL Web...');

  try {
    // Initialiser les modules
    initStorage();
    await initI18n();
    initSEO();

    // Initialiser les composants
    initAssistant();
    createFloatingWhatsAppButton();

    // Router
    setupRouter();

    // Navigation
    setupNavigation();

    // Language switcher
    setupLanguageSwitcher();

    // Footer newsletter
    setupNewsletter();

    // Charger la route initiale
    await handleRoute();

  } catch (error) {
    console.error('Erreur critique lors de l\'initialisation:', error);
    // Fallback en cas d'erreur critique
    const mainContent = document.getElementById('app-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="container text-center p-20">
          <h1>Une erreur est survenue</h1>
          <p>Veuillez rafraîchir la page.</p>
          <button onclick="window.location.reload()" class="btn btn--primary mt-4">Rafraîchir</button>
        </div>
      `;
    }
  }

  console.log('✅ GAL Web initialisé avec succès !');
}

/**
 * Configure le router
 */
function setupRouter() {
  // Écouter les changements de hash
  window.addEventListener('hashchange', handleRoute);

  // Gérer les liens internes
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      // If it's a hash link, let the browser handle it (hashchange will fire)
      if (href && href.startsWith('#/')) {
        return;
      }
      // If it's a link to a page file (legacy), prevent default and navigate via hash
      if (href && href.startsWith('pages/') && href.endsWith('.html')) {
        e.preventDefault();
        const pageName = href.split('/').pop().replace('.html', '');
        navigate(pageName);
      }
    }
  });
}

/**
 * Gère le routage
 */
async function handleRoute() {
  const hash = window.location.hash.substring(2) || ''; // Enlever #/
  const [routePath, ...params] = hash.split('/');

  const route = routes[routePath] || routes['home'];

  console.log(`📍 Navigation vers: ${routePath || 'home'}`);

  appState.currentRoute = routePath;

  // Mettre à jour la navigation active
  updateActiveNav(routePath);

  // Charger la vue
  await loadView(route, params);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Navigue vers une route
 */
export function navigate(path) {
  window.location.hash = `#/${path}`;
}

/**
 * Charge une vue
 */
async function loadView(route, params = []) {
  const mainContent = document.getElementById('app-content');

  if (!mainContent) {
    console.error('Element #app-content non trouvé');
    return;
  }

  // Timeout de sécurité pour éviter le chargement infini
  const loadingTimeout = setTimeout(() => {
    if (mainContent.innerHTML.includes('spinner')) {
      mainContent.innerHTML = `
        <div class="container text-center p-20">
          <p>Le chargement prend plus de temps que prévu...</p>
          <button onclick="window.location.reload()" class="btn btn--sm btn--ghost mt-4">Recharger</button>
        </div>
      `;
    }
  }, 5000);

  try {
    // Afficher un loader
    mainContent.innerHTML = '<div class="container text-center p-20"><div class="spinner spinner--lg"></div></div>';

    let content = '';

    // Redirection pour l'admin
    if (route.view === 'admin') {
      window.location.href = 'admin/index.html';
      clearTimeout(loadingTimeout);
      return;
    }
    // Charger depuis un fichier HTML
    else if (route.file) {
      const response = await fetch(route.file);
      if (response.ok) {
        const text = await response.text();
        // Check if full HTML document
        if (text.trim().toLowerCase().startsWith('<!doctype') || text.includes('<html')) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          // Try to find the main content wrapper
          // We look for #page-content, or main, or body
          const contentNode = doc.getElementById('page-content') || doc.querySelector('main') || doc.body;
          content = contentNode.innerHTML;
        } else {
          content = text;
        }
      } else {
        content = `<div class="container text-center p-20"><h1>404</h1><p>Page non trouvée</p></div>`;
      }
    }

    mainContent.innerHTML = content;

    // Initialiser les composants de la page
    initPageComponents();

    // Charger le script de la page si nécessaire
    if (route.script) {
      try {
        const module = await import(route.script);
        if (module.init) {
          await module.init();
        }
      } catch (err) {
        console.error(`Erreur chargement script ${route.script}:`, err);
      }
    }

    // Mettre à jour le SEO
    setPageMeta({
      title: t(`nav.${route.view}`) || route.title,
      description: `${route.title} - GAL Lubumbashi`
    });

  } catch (error) {
    console.error('Erreur lors du chargement de la vue:', error);
    mainContent.innerHTML = `
      <div class="container text-center p-20">
        <h1 class="text-error">Erreur</h1>
        <p>${t('error')}</p>
        <p class="text-sm text-muted mt-2">${error.message}</p>
      </div>
    `;
  } finally {
    clearTimeout(loadingTimeout);
  }
}



/**
 * Initialise les composants de la page
 */
function initPageComponents() {
  // WhatsApp buttons
  initWhatsAppButtons();

  // Accordions
  initAccordion();

  // Animate counters for stats
  animateCounters();

  // Traductions
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

/**
 * Anime les compteurs de statistiques
 */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

/**
 * Met à jour la navigation active
 */
function updateActiveNav(routePath) {
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    // Handle both hash links (#/videos) and legacy links (pages/videos.html)
    let linkPath = '';
    if (href.startsWith('#/')) {
      linkPath = href.substring(2);
    } else if (href.startsWith('pages/')) {
      linkPath = href.split('/').pop().replace('.html', '');
    } else if (href === 'index.html' || href === '/index.html' || href === '#/home') {
      linkPath = 'home';
    }

    if (linkPath === routePath || (routePath === '' && linkPath === 'home')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Configure la navigation
 */
function setupNavigation() {
  // Mobile menu toggle
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
    });

    // Fermer le menu au clic sur un lien
    menu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Sticky header on scroll
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }
}

/**
 * Configure le sélecteur de langue
 */
function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.dataset.lang;
      await changeLang(lang);
      // Recharger la vue pour appliquer les traductions
      await handleRoute();
    });
  });
}

/**
 * Configure la newsletter
 */
function setupNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;

    try {
      const { addNewsletterSubscriber } = await import('./storage.js');
      await addNewsletterSubscriber(email);

      const { showToast } = await import('./ui.js');
      showToast(t('newsletter.success'), 'success');
      form.reset();
    } catch (error) {
      const { showToast } = await import('./ui.js');
      showToast(t('newsletter.error'), 'error');
    }
  });
}

// Initialiser l'app au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export default {
  initApp,
  navigate
};
