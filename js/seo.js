/**
 * seo.js - Gestion SEO dynamique
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { t } from './i18n.js';

const DEFAULT_META = {
    defaultImage: '/public/images/og-image.jpg',
    defaultUrl: window.location.origin,
    twitter: '@GAL_Lubumbashi',
    locale: 'fr_FR',
    type: 'website'
};

/**
 * Définit le titre de la page
 * @param {string} title - Titre de la page
 * @param {boolean} withSiteName - Ajouter le nom du site
 */
export function setTitle(title, withSiteName = true) {
    const siteName = t('meta.site_name');
    const fullTitle = withSiteName ? `${title} | ${siteName}` : title;

    // Title tag
    document.title = fullTitle;

    // Open Graph
    updateMetaTag('og:title', fullTitle);

    // Twitter
    updateMetaTag('twitter:title', fullTitle, 'name');
}

/**
 * Définit la description
 * @param {string} description - Description de la page
 */
export function setDescription(description) {
    updateMetaTag('description', description, 'name');
    updateMetaTag('og:description', description);
    updateMetaTag('twitter:description', description, 'name');
}

/**
 * Définit les tags Open Graph
 * @param {object} options - Options OG
 */
export function setOG(options = {}) {
    const {
        title = t('meta.default_title'),
        description = t('meta.default_description'),
        image = DEFAULT_META.defaultImage,
        url = window.location.href,
        type = DEFAULT_META.type
    } = options;

    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', getAbsoluteUrl(image));
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', t('meta.site_name'));
    updateMetaTag('og:locale', DEFAULT_META.locale);
}

/**
 * Définit les tags Twitter Card
 * @param {object} options - Options Twitter
 */
export function setTwitterCard(options = {}) {
    const {
        title = t('meta.default_title'),
        description = t('meta.default_description'),
        image = DEFAULT_META.defaultImage,
        card = 'summary_large_image'
    } = options;

    updateMetaTag('twitter:card', card, 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', getAbsoluteUrl(image), 'name');

    if (DEFAULT_META.twitter) {
        updateMetaTag('twitter:site', DEFAULT_META.twitter, 'name');
    }
}

/**
 * Définit le canonical URL
 * @param {string} url - URL canonique
 */
export function setCanonical(url = window.location.href) {
    let link = document.querySelector('link[rel="canonical"]');

    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }

    link.setAttribute('href', url);
}

/**
 * Définit les metas pour une page spécifique
 * @param {object} pageData - Données de la page
 */
export function setPageMeta(pageData = {}) {
    const {
        title,
        description,
        image,
        url,
        type,
        keywords
    } = pageData;

    if (title) setTitle(title);
    if (description) setDescription(description);

    setOG({ title, description, image, url, type });
    setTwitterCard({ title, description, image });
    setCanonical(url);

    if (keywords) {
        updateMetaTag('keywords', keywords.join(', '), 'name');
    }
}

/**
 * Définit les metas pour un article de blog
 * @param {object} article - Article de blog
 */
export function setBlogMeta(article) {
    setPageMeta({
        title: article.title,
        description: article.excerpt,
        image: article.cover,
        url: `${window.location.origin}/blog/${article.slug}`,
        type: 'article',
        keywords: article.tags
    });

    // Meta tags spécifiques aux articles
    if (article.date) {
        updateMetaTag('article:published_time', article.date);
    }

    if (article.tags && article.tags.length > 0) {
        // Supprimer les anciennes tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());

        // Ajouter les nouvelles
        article.tags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'article:tag');
            meta.setAttribute('content', tag);
            document.head.appendChild(meta);
        });
    }
}

/**
 * Définit les metas pour une machine
 * @param {object} machine - Machine
 */
export function setMachineMeta(machine) {
    const description = machine.specs && machine.specs.length > 0
        ? `${machine.name} - ${machine.specs.map(s => s.value).join(', ')}`
        : machine.name;

    setPageMeta({
        title: machine.name,
        description,
        image: machine.image,
        url: `${window.location.origin}/machines/${machine.slug}`,
        type: 'product'
    });

    // Product meta tags
    updateMetaTag('product:price:amount', machine.priceRange);
    updateMetaTag('product:price:currency', 'USD');
    updateMetaTag('product:availability', machine.status === 'Disponible' ? 'in stock' : 'out of stock');
}

/**
 * Met à jour ou crée un meta tag
 * @param {string} property - Propriété du meta tag
 * @param {string} content - Contenu
 * @param {string} attr - Attribut (property ou name)
 */
function updateMetaTag(property, content, attr = 'property') {
    if (!content) return;

    let meta = document.querySelector(`meta[${attr}="${property}"]`);

    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
}

/**
 * Convertit une URL relative en URL absolue
 * @param {string} url - URL potentiellement relative
 * @returns {string} URL absolue
 */
function getAbsoluteUrl(url) {
    if (!url) return DEFAULT_META.defaultImage;
    if (url.startsWith('http')) return url;

    const base = window.location.origin;
    return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
}

/**
 * Génère le JSON-LD pour le SEO
 * @param {object} data - Données structurées
 */
export function setJSONLD(data) {
    // Supprimer l'ancien script JSON-LD s'il existe
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
        existingScript.remove();
    }

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

/**
 * Génère JSON-LD pour l'organisation
 */
export function setOrganizationSchema() {
    setJSONLD({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Groupement des Artisans de Lubumbashi',
        alternateName: 'GAL',
        url: window.location.origin,
        logo: `${window.location.origin}/public/logo-gal-official.jpg`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+243-979-022-998',
            contactType: 'customer service',
            areaServed: 'CD',
            availableLanguage: ['French', 'English']
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lubumbashi',
            addressRegion: 'Haut-Katanga',
            addressCountry: 'CD'
        },
        sameAs: [
            'https://facebook.com/GAL',
            'https://linkedin.com/company/GAL',
            'https://youtube.com/GAL'
        ]
    });
}

/**
 * Génère JSON-LD pour un article de blog
 * @param {object} article - Article
 */
export function setBlogArticleSchema(article) {
    setJSONLD({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: getAbsoluteUrl(article.cover),
        datePublished: article.date,
        dateModified: article.dateModified || article.date,
        author: {
            '@type': 'Organization',
            name: 'GAL'
        },
        publisher: {
            '@type': 'Organization',
            name: 'GAL',
            logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/public/logo-gal-official.jpg`
            }
        },
        description: article.excerpt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${window.location.origin}/blog/${article.slug}`
        }
    });
}

/**
 * Génère JSON-LD pour un produit (machine)
 * @param {object} machine - Machine
 */
export function setProductSchema(machine) {
    setJSONLD({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: machine.name,
        image: getAbsoluteUrl(machine.image),
        description: machine.specs ? machine.specs.map(s => `${s.label}: ${s.value}`).join(', ') : '',
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: machine.priceRange,
            availability: machine.status === 'Disponible'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
        }
    });
}

/**
 * Initialise les metas SEO par défaut
 */
export function initSEO() {
    setTitle(t('meta.default_title'), false);
    setDescription(t('meta.default_description'));
    setOG();
    setTwitterCard();
    setCanonical();
    setOrganizationSchema();
}

export default {
    setTitle,
    setDescription,
    setOG,
    setTwitterCard,
    setCanonical,
    setPageMeta,
    setBlogMeta,
    setMachineMeta,
    setJSONLD,
    setOrganizationSchema,
    setBlogArticleSchema,
    setProductSchema,
    initSEO
};
