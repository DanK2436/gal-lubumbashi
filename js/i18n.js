/**
 * i18n.js - Système multilingue (FR/EN)
 * GAL - Groupement des Artisans de Lubumbashi
 */

import { getLanguage, setLanguage as saveLanguage } from './storage.js';

// Traductions
const translations = {
    fr: {
        // Navigation
        'nav.home': 'Accueil',
        'nav.videos': 'Vidéos',
        'nav.formations': 'Formations',
        'nav.machines': 'Machines',
        'nav.blog': 'Blog',
        'nav.faq': 'FAQ',
        'nav.about': 'À propos',
        'nav.contact': 'Contact',

        // Hero
        'hero.title': 'Groupement des Artisans de Lubumbashi',
        'hero.subtitle': 'Clarté, performance, et précision au service de vos projets.',
        'hero.cta.primary': 'Nous contacter',
        'hero.cta.secondary': 'En savoir plus',

        // Home Services
        'home.services.videos.title': 'Vidéos & Réalisations',
        'home.services.videos.desc': 'Découvrez nos projets à travers une galerie complète de vidéos',
        'home.services.videos.btn': 'Voir les vidéos',
        'home.services.formations.title': 'Formations Professionnelles',
        'home.services.formations.desc': 'Développez vos compétences avec nos formations de qualité',
        'home.services.formations.btn': 'Voir les formations',
        'home.services.machines.title': 'Machines & Équipements',
        'home.services.machines.desc': 'Équipements professionnels de haute qualité',
        'home.services.machines.btn': 'Voir le catalogue',

        // Home CTA
        'home.cta.title': 'Prêt à commencer votre projet ?',
        'home.cta.subtitle': 'Contactez-nous dès aujourd\'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider.',
        'home.cta.btn_quote': 'Demander un devis',
        'home.cta.btn_whatsapp': 'WhatsApp',

        // Services
        'services.title': 'Nos Services',
        'services.subtitle': 'Des solutions complètes pour tous vos besoins',

        // Vidéos
        'videos.title': 'Nos Réalisations',
        'videos.subtitle': 'Découvrez nos projets en vidéo',
        'videos.filter_all': 'Toutes',
        'videos.loading': 'Chargement des vidéos...',
        'videos.short': 'Vidéos courtes',
        'videos.duration': 'Durée',
        'videos.category': 'Catégorie',
        'videos.all_categories': 'Toutes les catégories',
        'videos.no_results': 'Aucune vidéo trouvée',
        'videos.subscribe.title': 'Abonnez-vous à notre chaîne',
        'videos.subscribe.subtitle': 'Restez informé de nos dernières vidéos et tutoriels',
        'videos.subscribe.more': 'Voir plus de vidéos',
        'videos.filter.placeholder': 'Rechercher une vidéo...',
        'videos.loading': 'Chargement des vidéos...',
        'videos.filter.retry': 'Essayez de modifier vos filtres',

        // Formations
        'formations.title': 'Formations Professionnelles',
        'formations.subtitle': 'Développez vos compétences avec nos experts',
        'formations.search_placeholder': 'Rechercher...',
        'formations.filter_all': 'Tous',
        'formations.loading': 'Chargement des formations...',
        'formations.theme': 'Thème',
        'formations.all_themes': 'Tous les thèmes',
        'formations.length': 'Durée',
        'formations.start': 'Commencer la formation',
        'formations.no_results': 'Aucune formation trouvée',
        'formations.filter.placeholder': 'Rechercher une formation...',
        'formations.loading': 'Chargement des formations...',
        'formations.filter.retry': 'Essayez de modifier vos filtres',
        'formations.why.title': 'Pourquoi choisir nos formations ?',
        'formations.why.cert.title': 'Certification reconnue',
        'formations.why.cert.desc': 'Obtenez un certificat reconnu par les professionnels du secteur',
        'formations.why.expert.title': 'Formateurs experts',
        'formations.why.expert.desc': 'Apprenez auprès de professionnels expérimentés',
        'formations.why.practice.title': 'Pratique intensive',
        'formations.why.practice.desc': '70% de pratique pour une maîtrise parfaite',
        'formations.cta.title': 'Prêt à vous former ?',
        'formations.cta.subtitle': 'Contactez-nous pour plus d\'informations sur nos formations et modalités d\'inscription',
        'formations.cta.request': 'Demander des informations',

        // Machines
        'machines.title': 'Catalogue Machines',
        'machines.subtitle': 'Équipements professionnels de haute qualité',
        'machines.filters_title': 'Filtres',
        'machines.filter_category': 'Catégorie',
        'machines.category_all': 'Toutes',
        'machines.filter_availability': 'Disponibilité',
        'machines.status_available': 'En stock',
        'machines.status_order': 'Sur commande',
        'machines.reset_filters': 'Réinitialiser',
        'machines.loading': 'Chargement du catalogue...',
        'machines.specs': 'Spécifications',
        'machines.price_range': 'Fourchette de prix',
        'machines.status': 'Statut',
        'machines.available': 'Disponible',
        'machines.on_order': 'Sur commande',
        'machines.interested': 'Je suis intéressé(e)',
        'machines.no_results': 'Aucune machine trouvée',
        'machines.filter.placeholder': 'Rechercher une machine...',
        'machines.loading': 'Chargement des machines...',
        'machines.filter.retry': 'Essayez de modifier vos filtres',
        'machines.cta.title': 'Vous ne trouvez pas ce que vous cherchez ?',
        'machines.cta.subtitle': 'Contactez-nous ! Nous pouvons vous aider à trouver la machine parfaite pour vos besoins.',
        'machines.cta.quote': 'Demander un devis',

        // À propos
        'about.title': 'À propos de GAL',
        'about.subtitle': 'Groupement des Artisans de Lubumbashi',
        'about.history.title': 'Notre Histoire',
        'about.history.p1': 'Fondé en 2025, le Groupement des Artisans de Lubumbashi (GAL) est né de la volonté de regrouper et de structurer les artisans de la région. Notre mission est de promouvoir l\'excellence artisanale et de faciliter l\'accès aux équipements professionnels de qualité.',
        'about.history.p2': 'Avec 15 artisans membres, nous sommes un acteur en croissance du développement économique local, offrant formations, équipements et opportunités de networking à nos membres.',
        'about.history.p3': 'Notre engagement : soutenir l\'artisanat local et contribuer au développement des compétences professionnelles à Lubumbashi et dans toute la région.',
        'about.mission.title': 'Notre Mission',
        'about.mission.text': 'Structurer, former et équiper les artisans de Lubumbashi pour qu\'ils puissent offrir des services de qualité professionnelle et contribuer au développement économique de la région.',
        'about.vision.title': 'Notre Vision',
        'about.vision.text': 'Devenir le premier groupement d\'artisans en RDC, reconnu pour son excellence, son professionnalisme et sa contribution au développement des compétences artisanales dans toute la région.',
        'about.values.title': 'Nos Valeurs',
        'about.values.subtitle': 'Les piliers qui guident notre action quotidienne',
        'about.values.excellence': 'Excellence',
        'about.values.excellence_desc': 'Nous visons l\'excellence dans tout ce que nous faisons',
        'about.values.solidarity': 'Solidarité',
        'about.values.solidarity_desc': 'Nous nous entraidons pour grandir ensemble',
        'about.values.training': 'Formation',
        'about.values.training_desc': 'Nous croyons au développement continu des compétences',
        'about.values.innovation': 'Innovation',
        'about.values.innovation_desc': 'Nous adoptons les meilleures pratiques modernes',
        'about.stats.members': 'Artisans membres',
        'about.stats.trainings': 'Formations données',
        'about.stats.machines': 'Machines vendues',
        'about.stats.founding': 'Année de création',
        'about.services.title': 'Nos Services',
        'about.services.subtitle': 'Comment nous accompagnons nos membres',
        'about.services.equipment': 'Vente d\'équipements',
        'about.services.equipment_desc': 'Accès à un large catalogue de machines et outils professionnels à prix préférentiels',
        'about.services.training': 'Formations',
        'about.services.training_desc': 'Programmes de formation certifiants dans divers métiers artisanaux',
        'about.services.networking': 'Networking',
        'about.services.networking_desc': 'Événements réguliers pour créer des opportunités de collaboration',
        'about.services.consulting': 'Conseil',
        'about.services.consulting_desc': 'Accompagnement personnalisé pour le développement de votre activité',
        'about.services.videos': 'Ressources vidéo',
        'about.services.videos_desc': 'Bibliothèque de tutoriels et démonstrations pratiques',
        'about.services.blog': 'Blog',
        'about.services.blog_desc': 'Actualités, conseils et bonnes pratiques du monde artisanal',
        'about.cta.join': 'Rejoignez-nous !',
        'about.cta.subtitle': 'Faites partie de notre communauté d\'artisans passionnés',
        'about.cta.member': 'Devenir membre',
        'about.cta.contact': 'Nous contacter',

        // Actions générales
        'actions.view_catalog': 'Voir le catalogue',
        'actions.learn_more': 'En savoir plus',
        'actions.contact': 'Contactez-nous',
        'actions.read_more': 'Lire la suite',
        'actions.watch': 'Regarder',
        'actions.details': 'Voir détails',
        'actions.whatsapp': 'Contacter via WhatsApp',
        'actions.whatsapp_machine': 'Commander',

        // Contact
        'contact.title': 'Contact us',
        'contact.subtitle': 'We are listening',
        'contact.name': 'Full name',
        'contact.email': 'Email',
        'contact.message': 'Message',
        'contact.reason': 'Contact reason',
        'contact.reason.service': 'Question about a service',
        'contact.reason.machine': 'Question about a machine',
        'contact.reason.formation': 'Question about a training',
        'contact.reason.other': 'Other',
        'contact.consent': 'I agree that my data may be used to contact me',
        'contact.success': 'Message sent successfully!',
        'contact.error': 'An error occurred',
        'contact.form.title': 'Send us a message',
        'contact.form.name': 'Full name *',
        'contact.form.name_placeholder': 'Your name',
        'contact.form.email': 'Email *',
        'contact.form.email_placeholder': 'your.email@example.com',
        'contact.form.phone': 'Phone',
        'contact.form.phone_placeholder': '+243 979 022 998',
        'contact.form.subject': 'Subject *',
        'contact.form.subject_placeholder': 'Choose a subject',
        'contact.form.subject.adhesion': 'GAL Membership',
        'contact.form.subject.formation': 'Training Information',
        'contact.form.subject.machine': 'Machine Quote Request',
        'contact.form.subject.partenariat': 'Partnership Proposal',
        'contact.form.subject.other': 'Other',
        'contact.form.message': 'Message *',
        'contact.form.message_placeholder': 'Describe your request...',
        'contact.form.submit': 'Send message',
        'contact.info.title': 'Contact Information',
        'contact.info.address': 'Address',
        'contact.info.phone': 'Phone',
        'contact.info.email': 'Email',
        'contact.info.hours': 'Opening Hours',
        'contact.info.hours_text': 'Monday - Friday: 8am - 5pm<br>Saturday: 8am - 1pm<br>Sunday: Closed',
        'contact.quick.title': 'Quick Contact',
        'contact.quick.subtitle': 'Need an immediate answer?',
        'contact.quick.whatsapp': '💬 WhatsApp',
        'contact.quick.chatbot': '🤖 Chatbot',
        'contact.faq.title': 'Questions Fréquentes',
        'faq.q1.q': 'Comment devenir membre de GAL ?',
        'faq.q1.a': 'Pour devenir membre de GAL, vous devez être un artisan actif dans la région de Lubumbashi. Contactez-nous via le formulaire de contact ou WhatsApp pour démarrer le processus d\'adhésion. Nous vous guiderons à travers les étapes nécessaires.',
        'faq.q2.q': 'Quel est le coût de l\'adhésion ?',
        'faq.q2.a': 'La cotisation annuelle est de 50 USD. Ce montant donne accès à tous les services de GAL : formations à tarif réduit, prix préférentiels sur les machines, événements de networking et accompagnement personnalisé.',
        'faq.q3.q': 'Quels sont les avantages d\'être membre ?',
        'faq.q3.a': 'Les membres bénéficient de prix réduits sur les machines et formations, d\'un accès prioritaire aux nouvelles opportunités, d\'un réseau professionnel étendu, de conseils personnalisés et d\'une certification professionnelle reconnue.',
        'faq.q4.q': 'Les formations sont-elles certifiées ?',
        'faq.q4.a': 'Oui, toutes nos formations délivrent un certificat reconnu par les professionnels du secteur. Ce certificat atteste de vos compétences et peut faciliter votre intégration professionnelle.',
        'faq.q5.q': 'Quelle est la durée des formations ?',
        'faq.q5.a': 'La durée varie selon le type de formation : de quelques jours pour les modules courts à plusieurs semaines pour les cursus complets. Consultez notre page Formations pour plus de détails sur chaque programme.',
        'faq.q6.q': 'Puis-je suivre une formation sans être membre ?',
        'faq.q6.a': 'Oui, les formations sont ouvertes à tous. Cependant, les membres bénéficient de tarifs préférentiels allant jusqu\'à 30% de réduction.',
        'faq.q7.q': 'Proposez-vous un service après-vente ?',
        'faq.q7.a': 'Absolument ! Nous offrons un service après-vente complet incluant la maintenance, les pièces de rechange et l\'assistance technique. Une garantie de 1 à 2 ans est incluse selon le type de machine.',
        'faq.q8.q': 'Les machines sont-elles neuves ou d\'occasion ?',
        'faq.q8.a': 'Nous proposons principalement des machines neuves avec garantie constructeur. Nous avons également une sélection de machines d\'occasion révisées et certifiées à prix réduit.',
        'faq.q9.q': 'Proposez-vous des facilités de paiement ?',
        'faq.q9.a': 'Oui, nous proposons des solutions de paiement échelonné pour l\'achat de machines. Les modalités sont définies au cas par cas en fonction du montant et de votre profil. Contactez-nous pour discuter des options.',
        'faq.q10.q': 'Puis-je voir les machines avant d\'acheter ?',
        'faq.q10.a': 'Bien sûr ! Nous vous invitons à visiter notre showroom pour voir et tester les machines. Prenez rendez-vous via notre page contact ou WhatsApp.',
        'faq.q11.q': 'Organisez-vous des événements de networking ?',
        'faq.q11.a': 'Oui, nous organisons régulièrement des événements (trimestriels) où les membres peuvent se rencontrer, échanger et créer des partenariats. Les dates sont communiquées via notre newsletter.',
        'faq.q12.q': 'Proposez-vous des services de conseil ?',
        'faq.q12.a': 'Oui, nous offrons un accompagnement personnalisé pour le développement de votre activité : choix d\'équipements, optimisation des processus, stratégie commerciale, etc.',
        'faq.q13.q': 'Comment s\'abonner à la newsletter ?',
        'faq.q13.a': 'Vous pouvez vous abonner directement via le formulaire dans le pied de page de notre site. Vous recevrez ensuite toutes nos actualités, événements et offres spéciales.',
        'faq.q14.q': 'Le chatbot peut-il répondre à toutes mes questions ?',
        'faq.q14.a': 'Notre chatbot peut répondre aux questions courantes 24h/24 et 7j/7. Pour des demandes plus spécifiques, nous vous invitons à contacter directement notre équipe.',


        // Blog
        'blog.title': 'Blog',
        'blog.subtitle': 'News and tips',
        'blog.by': 'By',
        'blog.on': 'on',
        'blog.tags': 'Tags',
        'blog.related': 'Related articles',
        'blog.no_results': 'No articles found',

        // Newsletter
        'newsletter.title': 'Stay informed',
        'newsletter.subtitle': 'Subscribe to our newsletter',
        'newsletter.email_placeholder': 'Your email',
        'newsletter.success': 'You are now subscribed!',
        'newsletter.error': 'This email is already registered',

        // Footer
        'footer.about': 'About',
        'footer.quick_links': 'Quick links',
        'footer.contact': 'Contact',
        'footer.follow_us': 'Follow us',
        'footer.rights': 'All rights reserved',
        'footer.legal': 'Legal notice',
        'footer.privacy': 'Privacy policy',

        // Chatbot
        'chatbot.title': 'GAL Assistant',
        'chatbot.welcome': 'Hello! How can I help you?',
        'chatbot.placeholder': 'Type your message...',
        'chatbot.talk_to_human': 'Talk to a human',
        'chatbot.hours': 'Our hours: Monday-Friday, 8am-5pm',
        'chatbot.input_label': 'Message input',
        'chatbot.intro.1': 'Of course! ',
        'chatbot.intro.2': 'Excellent question! ',
        'chatbot.intro.3': 'I can answer that. ',
        'chatbot.intro.4': 'Let me explain. ',
        'chatbot.intro.5': 'With pleasure! ',
        'chatbot.default_response': 'I\'m not sure I understand your question, but I can help you with several topics:',
        'chatbot.suggestions.title': '💬 Available topics:',
        'chatbot.suggestions.1': '✓ GAL Membership and benefits',
        'chatbot.suggestions.2': '✓ Our certified trainings',
        'chatbot.suggestions.3': '✓ Machine catalog',
        'admin.dashboard': 'Dashboard',
        'admin.videos': 'Manage videos',
        'admin.formations': 'Manage trainings',
        'admin.machines': 'Manage machines',
        'admin.blog': 'Manage blog',
        'admin.newsletter': 'Newsletter',
        'admin.pages': 'Static pages',
        'admin.login': 'Login',
        'admin.password': 'Password',
        'admin.login_error': 'Invalid email or password',
        'admin.logout_confirm': 'Do you really want to logout?',
        'admin.delete_confirm': 'Are you sure you want to delete this item?',
        'admin.save_success': 'Saved successfully',
        'admin.delete_success': 'Deleted successfully',

        // Validation
        'validation.required': 'This field is required',
        'validation.email': 'Invalid email',
        'validation.min_length': 'Minimum {min} characters',
        'validation.max_length': 'Maximum {max} characters',
        'validation.min_value': 'Minimum value: {min}',
        'validation.max_value': 'Maximum value: {max}',

        // Divers
        'loading': 'Chargement...',
        'loading_message': 'Chargement...',
        'error': 'Une erreur s\'est produite',
        'no_data': 'Aucune donnée disponible',
        'search_results': 'Résultats de recherche',
        'showing': 'Affichage',
        'of': 'sur',
        'results': 'résultats',
        'page': 'Page',
        'prev': 'Précédent',
        'next': 'Suivant',

        // Accessibility
        'a11y.skip_link': 'Aller au contenu principal',

        // Footer description
        'footer.description': 'Le Groupement des Artisans de Lubumbashi (GAL) est votre partenaire de confiance pour tous vos besoins en machines, formations et services professionnels.'
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.videos': 'Videos',
        'nav.formations': 'Trainings',
        'nav.machines': 'Machines',
        'nav.blog': 'Blog',
        'nav.faq': 'FAQ',
        'nav.about': 'About',
        'nav.contact': 'Contact',

        // Hero
        'hero.title': 'Group of Artisans of Lubumbashi',
        'hero.subtitle': 'Clarity, performance, and precision serving your projects.',
        'hero.cta.primary': 'Contact us',
        'hero.cta.secondary': 'Learn more',

        // Home Services
        'home.services.videos.title': 'Videos & Projects',
        'home.services.videos.desc': 'Explore our projects through a complete video gallery',
        'home.services.videos.btn': 'View videos',
        'home.services.formations.title': 'Professional Trainings',
        'home.services.formations.desc': 'Develop your skills with our quality trainings',
        'home.services.formations.btn': 'View trainings',
        'home.services.machines.title': 'Machines & Equipment',
        'home.services.machines.desc': 'High-quality professional equipment',
        'home.services.machines.btn': 'View catalog',

        // Home CTA
        'home.cta.title': 'Ready to start your project?',
        'home.cta.subtitle': 'Contact us today to discuss your needs and see how we can help.',
        'home.cta.btn_quote': 'Request a quote',
        'home.cta.btn_whatsapp': 'WhatsApp',

        // Chatbot
        'chatbot.title': 'GAL Assistant',
        'chatbot.welcome': 'Hello! How can I help you?',
        'chatbot.placeholder': 'Type your message...',
        'chatbot.talk_to_human': 'Talk to a human',
        'chatbot.hours': 'Our hours: Monday-Friday, 8am-5pm',
        'chatbot.input_label': 'Message input',

        // Footer
        'footer.about': 'About',
        'footer.quick_links': 'Quick links',
        'footer.contact': 'Contact',
        'footer.follow_us': 'Follow us',
        'footer.rights': 'All rights reserved',
        'footer.legal': 'Legal notice',
        'footer.privacy': 'Privacy policy',
        'footer.description': 'The Group of Artisans of Lubumbashi (GAL) is your trusted partner for all your needs in machines, training and professional services.',

        // Newsletter
        'newsletter.title': 'Stay informed',
        'newsletter.subtitle': 'Subscribe to our newsletter',
        'newsletter.email_placeholder': 'Your email',

        // Actions
        'actions.whatsapp': 'Contact via WhatsApp',

        // Loading
        'loading': 'Loading...',
        'loading_message': 'Loading...',
        'error': 'An error occurred',

        // Accessibility
        'a11y.skip_link': 'Skip to main content'
    }
};

let currentLanguage = 'fr';

/**
 * Initialise le système i18n
 */
export async function initI18n() {
    currentLanguage = await getLanguage();
    updatePageLanguage();
}

/**
 * Traduit une clé
 * @param {string} key - Clé de traduction
 * @param {object} params - Paramètres optionnels pour interpolation
 * @returns {string}
 */
export function t(key, params = {}) {
    let text = translations[currentLanguage]?.[key] || key;

    // Interpolation des paramètres {param}
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

/**
 * Change la langue
 * @param {string} lang - Code de langue (fr/en)
 */
export async function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        await saveLanguage(lang);
        updatePageLanguage();

        // Émettre un événement custom
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
}

/**
 * Récupère la langue actuelle
 * @returns {string}
 */
export function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Met à jour tous les éléments avec data-i18n
 */
function updatePageLanguage() {
    // Éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Éléments avec data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });

    // Éléments avec data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', t(key));
    });

    // Éléments avec data-i18n-aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        el.setAttribute('aria-label', t(key));
    });

    // Mettre à jour l'attribut lang du HTML
    document.documentElement.setAttribute('lang', currentLanguage);

    // Mettre à jour les sélecteurs de langue
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
}

export default {
    initI18n,
    t,
    setLanguage,
    getCurrentLanguage
};
