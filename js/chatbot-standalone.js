/**
 * Chatbot intelligent GAL - Version ultra-réaliste
 * Connecté à la FAQ et avec une personnalité humaine
 */

// Import des services de données pour un chatbot dynamique
import storage from './storage.js';
import { getBotResponse, getWelcomeMessage as getGeminiWelcome } from './chatbot.js';

// Stockage dynamique des données du site
let dynamicData = {
    formations: [],
    machines: [],
    projects: [],
    blog: []
};

let faqData = {
    adhesion: {
        q1: {
            keywords: ['membre', 'adhésion', 'adhérer', 'rejoindre', 'inscription', 'devenir membre', 'inscrire', 'rejoindre le groupe'],
            question: "Comment devenir membre de GAL ?",
            answer: "Pour devenir membre de GAL, vous devez être un artisan actif dans la région de Lubumbashi. Contactez-nous via le formulaire de contact ou WhatsApp pour démarrer le processus d'adhésion. Nous vous guiderons à travers les étapes nécessaires."
        },
        q2: {
            keywords: ['coût', 'prix', 'tarif', 'combien', 'payer', 'cotisation', 'montant'],
            question: "Quel est le coût de l'adhésion ?",
            answer: "La cotisation annuelle est de 50 USD. Ce montant donne accès à tous les services de GAL : formations à tarif réduit, prix préférentiels sur les machines, événements de networking et accompagnement personnalisé."
        },
        q3: {
            keywords: ['avantages', 'bénéfices', 'pourquoi', 'intérêt', 'utilité'],
            question: "Quels sont les avantages d'être membre ?",
            answer: "Les membres bénéficient de prix réduits sur les machines et formations, d'un accès prioritaire aux nouvelles opportunités, d'un réseau professionnel étendu, de conseils personnalisés et d'une certification professionnelle reconnue."
        }
    },
    formations: {
        q4: {
            keywords: ['certificat', 'certifié', 'certification', 'diplôme', 'reconnu'],
            question: "Les formations sont-elles certifiées ?",
            answer: "Oui, toutes nos formations délivrent un certificat reconnu par les professionnels du secteur. Ce certificat atteste de vos compétences et peut faciliter votre intégration professionnelle."
        },
        q5: {
            keywords: ['durée', 'temps', 'combien de temps', 'long', 'période'],
            question: "Quelle est la durée des formations ?",
            answer: "La durée varie selon le type de formation : de quelques jours pour les modules courts à plusieurs semaines pour les cursus complets. Consultez notre page Formations pour plus de détails sur chaque programme."
        },
        q6: {
            keywords: ['sans membre', 'non membre', 'obligatoire', 'nécessaire'],
            question: "Puis-je suivre une formation sans être membre ?",
            answer: "Oui, les formations sont ouvertes à tous. Cependant, les membres bénéficient de tarifs préférentiels allant jusqu'à 30% de réduction."
        },
        q17: {
            keywords: ['week-end', 'samedi', 'dimanche', 'weekend', 'disponibilité', 'horaire formation'],
            question: "Les formations sont-elles disponibles le week-end ?",
            answer: "Nous proposons des sessions de formation flexibles, y compris le samedi, pour s'adapter aux horaires des professionnels et des étudiants."
        }
    },
    machines: {
        q7: {
            keywords: ['après-vente', 'garantie', 'réparation', 'maintenance', 'service'],
            question: "Proposez-vous un service après-vente ?",
            answer: "Absolument ! Nous offrons un service après-vente complet incluant la maintenance, les pièces de rechange et l'assistance technique. Une garantie de 1 à 2 ans est incluse selon le type de machine."
        },
        q8: {
            keywords: ['neuve', 'occasion', 'état', 'qualité'],
            question: "Les machines sont-elles neuves ou d'occasion ?",
            answer: "Nous proposons principalement des machines neuves avec garantie constructeur. Nous avons également une sélection de machines d'occasion révisées et certifiées à prix réduit."
        },
        q9: {
            keywords: ['paiement', 'crédit', 'facilité', 'échelonné', 'mensualité', 'acheter', 'achat', 'payer'],
            question: "Comment acheter une machine ?",
            answer: "Pour acheter une machine, vous pouvez consulter notre catalogue en ligne. Une fois votre choix fait, contactez-nous pour établir un devis. Nous proposons des facilités de paiement échelonné selon votre profil."
        },
        q10: {
            keywords: ['voir', 'tester', 'essayer', 'showroom', 'visite'],
            question: "Puis-je voir les machines avant d'acheter ?",
            answer: "Bien sûr ! Nous vous invitons à visiter notre showroom pour voir et tester les machines. Prenez rendez-vous via notre page contact ou WhatsApp."
        },
        q15: {
            keywords: ['sur mesure', 'personnalisé', 'custom', 'spécial', 'commander', 'conception'],
            question: "Puis-je commander une machine sur mesure ?",
            answer: "Oui, nous sommes spécialisés dans la fabrication sur mesure. Nos ingénieurs peuvent concevoir une machine adaptée exactement à vos besoins et contraintes."
        },
        q16: {
            keywords: ['livraison', 'livrer', 'expédition', 'transport', 'dehors', 'province'],
            question: "Livrez-vous en dehors de Lubumbashi ?",
            answer: "Oui, nous expédions nos machines dans toute la RDC. Les frais de transport sont calculés en fonction de la destination et du poids de la machine."
        },
        q18: {
            keywords: ['garantie', 'couvre', 'assurance', 'défaut', 'protection'],
            question: "Que couvre la garantie de vos machines ?",
            answer: "La garantie couvre les défauts de fabrication et les pièces mécaniques principales. Elle ne couvre pas l'usure normale ou les dommages causés par une mauvaise utilisation."
        }
    },
    services: {
        q11: {
            keywords: ['événement', 'networking', 'rencontre', 'réseau'],
            question: "Organisez-vous des événements de networking ?",
            answer: "Oui, nous organisons régulièrement des événements (trimestriels) où les membres peuvent se rencontrer, échanger et créer des partenariats. Les dates sont communiquées via notre newsletter."
        },
        q12: {
            keywords: ['conseil', 'accompagnement', 'aide', 'support'],
            question: "Proposez-vous des services de conseil ?",
            answer: "Oui, nous offrons un accompagnement personnalisé pour le développement de votre activité : choix d'équipements, optimisation des processus, stratégie commerciale, etc."
        },
        q13: {
            keywords: ['newsletter', 'abonner', 'actualité', 'informations'],
            question: "Comment s'abonner à la newsletter ?",
            answer: "Vous pouvez vous abonner directement via le formulaire dans le pied de page de notre site. Vous recevrez ensuite toutes nos actualités, événements et offres spéciales."
        },
        q14: {
            keywords: ['chatbot', 'bot', 'assistant', 'répondre', 'questions', 'automatique', 'ia'],
            question: "Le chatbot peut-il répondre à toutes mes questions ?",
            answer: "Notre chatbot peut répondre aux questions courantes 24h/24 et 7j/7. Pour des demandes plus spécifiques, nous vous invitons à contacter directement notre équipe via WhatsApp ou le formulaire de contact."
        },
        q19: {
            keywords: ['vidéo', 'tutoriel', 'voir', 'regarder', 'youtube', 'chaine'],
            question: "Comment voir vos vidéos ?",
            answer: "Vous pouvez retrouver toutes nos vidéos, tutoriels et démonstrations sur notre page 'Vidéos' du site ou directement sur notre chaîne YouTube. C'est un excellent moyen de voir nos machines en action !"
        },
        q20: {
            keywords: ['suivre formation', 'inscrire formation', 'participer formation', 'apprendre'],
            question: "Comment suivre une formation ?",
            answer: "Pour suivre une formation, consultez notre catalogue de formations, choisissez celle qui vous intéresse et contactez-nous pour connaître les prochaines dates de session et les modalités d'inscription."
        }
    },
    privacy: {
        p1: {
            keywords: ['données', 'personnelles', 'confidentialité', 'privacy', 'rgpd', 'protection', 'vie privée', 'informations'],
            question: "Comment mes données personnelles sont-elles protégées ?",
            answer: "Nous prenons la protection de vos données très au sérieux. Toutes les informations collectées sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement explicite. Nous utilisons vos données uniquement pour améliorer nos services et vous tenir informé de nos actualités si vous y avez consenti."
        },
        p2: {
            keywords: ['collecte', 'collecter', 'récupérer', 'données collectées', 'quelles informations'],
            question: "Quelles données collectez-vous ?",
            answer: "Nous collectons uniquement les informations nécessaires : nom, email, téléphone (si vous nous contactez), et les données de navigation anonymisées pour améliorer l'expérience utilisateur. Lors d'une inscription à une formation ou d'un achat de machine, nous collectons les informations nécessaires à la transaction."
        },
        p3: {
            keywords: ['cookies', 'cookie', 'trackers', 'suivi', 'tracking'],
            question: "Utilisez-vous des cookies ?",
            answer: "Oui, nous utilisons des cookies essentiels pour le fonctionnement du site (mémorisation de la langue, panier, etc.). Nous n'utilisons pas de cookies publicitaires ou de suivi tiers. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur."
        },
        p4: {
            keywords: ['supprimer', 'effacer', 'compte', 'données', 'droit', 'oubli'],
            question: "Puis-je supprimer mes données ?",
            answer: "Absolument. Vous avez le droit de demander la suppression de vos données personnelles à tout moment. Contactez-nous par email à contact@gal-lubumbashi.com avec votre demande, et nous procéderons à la suppression dans les 30 jours."
        },
        p5: {
            keywords: ['partage', 'vendre', 'tiers', 'partenaires', 'données partagées'],
            question: "Partagez-vous mes données avec des tiers ?",
            answer: "Non, nous ne vendons ni ne louons vos données personnelles. Nous ne les partageons qu'avec des prestataires de services essentiels (hébergement web, emailing) qui sont contractuellement tenus de protéger vos informations et de les utiliser uniquement pour les services demandés."
        }
    },
    histoire: {
        h1: {
            keywords: ['année', 'années', 'existance', 'existence', 'âge', 'age', 'combien', 'ancien', 'ancienneté', 'fondé', 'fonde', 'créé', 'cree', 'depuis', 'quand', 'date', 'naissance'],
            question: "GAL a combien d'années d'existence ?",
            answer: "Le GAL (Groupement des Artisans de Lubumbashi) a été fondé en **2025** à Lubumbashi, en République Démocratique du Congo. Nous sommes donc une organisation jeune et dynamique, avec environ **1 an d'existence**. Malgré notre jeunesse, nous avons déjà livré plus de 50 machines et accompagné de nombreux artisans locaux. 🚀"
        },
        h2: {
            keywords: ['fondateur', 'fondateurs', 'créateur', 'qui a créé', 'qui a fondé', 'derrière', 'origine', 'lancer', 'lancé'],
            question: "Qui a fondé GAL ?",
            answer: "GAL a été fondé par un groupe d'artisans et d'ingénieurs passionnés de Lubumbashi, convaincus que l'Afrique doit fabriquer ses propres solutions industrielles. Notre philosophie : 'L'Afrique n'a pas besoin d'importer des solutions, elle doit les fabriquer elle-même.' 💪"
        },
        h3: {
            keywords: ['mission', 'objectif', 'but', 'raison', 'pourquoi', 'vocation', 'rôle'],
            question: "Quelle est la mission de GAL ?",
            answer: "Notre mission est de **propulser l'industrie locale** en concevant des outils mécaniques robustes, adaptés aux réalités du terrain congolais. Nous transformons des idées en productivité brute. Nous voulons faire de Lubumbashi le hub technologique de l'artisanat industriel en RDC. 🏭"
        },
        h4: {
            keywords: ['vision', 'futur', 'avenir', 'ambition', 'plan', '2030', 'projet futur', 'objectifs futurs'],
            question: "Quelle est la vision de GAL ?",
            answer: "Notre vision est ambitieuse : faire de Lubumbashi le **hub technologique de l'artisanat industriel en RDC**. D'ici **2030**, nous voulons que chaque entrepreneur local utilise au moins une solution signée GAL. Nous travaillons chaque jour pour rendre cette vision réalité ! 🎯"
        },
        h5: {
            keywords: ['où', 'ou', 'localisation', 'situé', 'situe', 'ville', 'pays', 'adresse', 'lubumbashi', 'rdc', 'congo'],
            question: "Où se trouve GAL ?",
            answer: "GAL est basé à **Lubumbashi**, dans la province du Haut-Katanga, en **République Démocratique du Congo** 🇨🇩. Lubumbashi est la deuxième ville du pays et un centre économique majeur. Nos ateliers et notre showroom y sont installés."
        },
        h6: {
            keywords: ['chiffre', 'statistique', 'résultat', 'bilan', 'réalisation', 'accomplissement', 'combien de machines', 'combien de membres'],
            question: "Quels sont les chiffres clés de GAL ?",
            answer: "Voici nos chiffres clés : 📊\n\n• **Fondation** : 2025 à Lubumbashi\n• **Équipe** : 20+ experts passionnés\n• **Machines livrées** : 50+\n• **Impact** : 100% local\n• **Membres** : 150+ artisans\n• **Projets réalisés** : 500+\n\nEt ce n'est que le début ! 🚀"
        }
    }
};

// Données détaillées des produits et services (Fallbacks)
const formationsList = [
    { title: "Électricité industrielle", keywords: ['électricité', 'électrique', 'industrielle', 'câblage', 'courant'], duration: "Complète", description: "Apprenez les fondamentaux de l'électricité industrielle, de l'installation aux normes de sécurité." },
    { title: "Soudure et métallurgie", keywords: ['soudure', 'tig', 'mig', 'arc', 'métal', 'métallurgie', 'fer'], duration: "Avancée", description: "Maîtrisez les techniques de soudure TIG, MIG et arc électrique." },
    { title: "Menuiserie professionnelle", keywords: ['menuiserie', 'bois', 'meuble', 'ébénisterie', 'table', 'chaise'], duration: "Professionnelle", description: "De la conception à la réalisation, apprenez l'art de la menuiserie moderne et traditionnelle." },
    { title: "Plomberie sanitaire", keywords: ['plomberie', 'sanitaire', 'tuyau', 'eau', 'fuite'], duration: "Complète", description: "Formation complète sur les systèmes de plomberie, sanitaires et évacuation des eaux." },
    { title: "Mécanique automobile", keywords: ['mécanique', 'auto', 'voiture', 'véhicule', 'moteur', 'panne'], duration: "Niveau Pro", description: "Diagnostic, réparation et entretien de tous types de véhicules." },
    { title: "Gestion de chantier", keywords: ['gestion', 'chantier', 'btp', 'construction', 'chef', 'projet'], duration: "Managériale", description: "Apprenez à gérer efficacement un chantier de construction, de la planification à la livraison." }
];

const machinesList = [
    { name: "Batteuse à Maïs Motorisée", keywords: ['batteuse', 'maïs', 'agricole', 'grain', 'récolte'], price: "1 200 USD", status: "Disponible", specs: "Capacité 1000 kg/h, Moteur Honda 6.5 HP" },
    { name: "Moule Bloc Ciment", keywords: ['moule', 'bloc', 'ciment', 'brique', 'parpaing', 'construction'], price: "150 USD", status: "Disponible", specs: "40x20x20 cm, 250 blocs/jour" },
    { name: "Rapeuse à Manioc", keywords: ['rapeuse', 'manioc', 'foufou', 'racine'], price: "Sur devis", status: "Disponible", specs: "Production constante, usage intensif" },
    { name: "Presse à Huile", keywords: ['presse', 'huile', 'arachide', 'graine', 'tournesol'], price: "Sur devis", status: "Sur commande", specs: "Extraction à froid/chaud, efficacité maximale" },
    { name: "Moule Buses Béton", keywords: ['moule', 'buse', 'béton', 'canalisation', 'tuyau'], price: "Sur devis", status: "Sur commande", specs: "Pour infrastructures, durabilité extrême" },
    { name: "Brouette Renforcée", keywords: ['brouette', 'transport', 'chantier', 'sable', 'brique'], price: "Sur devis", status: "Disponible", specs: "Charge lourde, structure renforcée, terrain difficile" },
    { name: "Coffret Métallique", keywords: ['coffret', 'armoire', 'électrique', 'métal', 'rangement'], price: "Sur devis", status: "Sur commande", specs: "Sur mesure, peinture époxy" },
    { name: "Pétrin Boulangerie", keywords: ['pétrin', 'boulangerie', 'pain', 'pâte', 'farine'], price: "Sur devis", status: "Sur commande", specs: "Cuve inox alimentaire, capacité variable" }
];

// Base de connaissances enrichie
const knowledge = {
    gal: {
        name: "Groupement des Artisans de Lubumbashi",
        about: "Le GAL est une organisation fondée en 2025 à Lubumbashi, en RDC. Nous regroupons plus de 150 artisans qualifiés et nous concevons des outils mécaniques robustes adaptés aux réalités du terrain congolais.",
        mission: "Propulser l'industrie locale en concevant des outils mécaniques robustes, adaptés aux réalités du terrain congolais.",
        vision: "Faire de Lubumbashi le hub technologique de l'artisanat industriel en RDC. D'ici 2030, chaque entrepreneur local utilisera au moins une solution signée GAL.",
        philosophie: "L'Afrique n'a pas besoin d'importer des solutions, elle doit les fabriquer elle-même.",
        fondation: 2025,
        lieu: "Lubumbashi, Haut-Katanga, RDC",
        contact: {
            phone: "+243 979 022 998",
            email: "contact@gal-lubumbashi.com",
            whatsapp: "243979022998"
        },
        stats: {
            members: "150+",
            projects: "500+",
            machines_livrees: "50+",
            experts: "20+",
            impact: "100% local"
        }
    }
};

// Expressions humaines pour rendre le chatbot plus réaliste
const humanExpressions = {
    thinking: ["Hmm, laissez-moi réfléchir...", "Bonne question !", "Intéressant...", "Voyons voir..."],
    agreement: ["Exactement !", "Tout à fait !", "C'est ça !", "Absolument !"],
    empathy: ["Je comprends votre question", "C'est une excellente question", "Beaucoup de gens se posent cette question"],
    encouragement: ["N'hésitez pas à demander plus de détails !", "Je suis là pour vous aider", "Continuez, je vous écoute"],
    transition: ["D'ailleurs,", "Au fait,", "À propos,", "En parlant de ça,"],
    enthusiasm: ["Super !", "Génial !", "Excellent choix !", "Parfait !"],
    closing: ["Est-ce que ça répond à votre question ?", "Vous avez d'autres questions ?", "Besoin d'autres informations ?"]
};

// Salutations contextuelles
const greetings = {
    morning: ["Bonjour !", "Bon matin !", "Hello !", "Salut !"],
    afternoon: ["Bonjour !", "Bon après-midi !", "Salut !"],
    evening: ["Bonsoir !", "Bonne soirée !", "Salut !"]
};

// Réponses aux émotions
const emotionalResponses = {
    merci: [
        "Avec grand plaisir ! 🤝",
        "De rien, c'est un plaisir de vous assister. 🔷",
        "Ravi d'avoir pu vous aider. ✅",
        "À votre service. ⚙️"
    ],
    frustration: [
        "Je comprends que ça puisse être frustrant. Laissez-moi essayer de mieux vous aider.",
        "Désolé si je n'ai pas été assez clair. Reformulez votre question et je ferai de mon mieux.",
        "Je vois que vous cherchez quelque chose de spécifique. Contactons directement l'équipe ?"
    ],
    confusion: [
        "Je sens que ma réponse n'est pas claire. Puis-je reformuler ?",
        "Hmm, je pense que je ne vous ai pas bien compris. Pouvez-vous préciser ?",
        "Laissez-moi être plus précis..."
    ]
};

// Charger toutes les données du site pour le chatbot
async function loadAllSiteData() {
    try {
        console.log('🔄 Chargement des données dynamiques du site pour Dan Kande...');

        const [formations, machines, projects, blog] = await Promise.all([
            storage.getFormations(),
            storage.getMachines(),
            storage.getProjects(),
            storage.getBlogPosts()
        ]);

        dynamicData.formations = formations || [];
        dynamicData.machines = machines || [];
        dynamicData.projects = projects || [];
        dynamicData.blog = blog || [];

        console.log(`✅ Données chargées : ${dynamicData.formations.length} formations, ${dynamicData.machines.length} machines, ${dynamicData.projects.length} projets, ${dynamicData.blog.length} articles.`);
    } catch (error) {
        console.warn('⚠️ Erreur lors du chargement des données dynamiques:', error);
    }
}

// Recherche dans les données dynamiques
function searchDynamicData(message) {
    const lowerMessage = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Chercher dans les machines
    const machine = dynamicData.machines.find(m =>
        lowerMessage.includes(m.name.toLowerCase()) ||
        (m.category && lowerMessage.includes(m.category.toLowerCase()))
    );
    if (machine) return { type: 'machine_dynamic', data: machine };

    // 2. Chercher dans les formations
    const formation = dynamicData.formations.find(f =>
        lowerMessage.includes(f.title.toLowerCase()) ||
        (f.level && lowerMessage.includes(f.level.toLowerCase()))
    );
    if (formation) return { type: 'formation_dynamic', data: formation };

    // 3. Chercher dans les projets (chantiers/conceptions)
    const project = dynamicData.projects.find(p =>
        lowerMessage.includes(p.title.toLowerCase())
    );
    if (project) return { type: 'project_dynamic', data: project };

    // 4. Chercher dans le blog
    const post = dynamicData.blog.find(b =>
        lowerMessage.includes(b.title.toLowerCase())
    );
    if (post) return { type: 'blog_dynamic', data: post };

    return null;
}

// ===== MOTEUR D'INTELLIGENCE AMÉLIORÉ =====

// Dictionnaire de synonymes pour comprendre plus de formulations
const synonymsMap = {
    'acheter': ['achat', 'commander', 'acquérir', 'procurer', 'obtenir', 'prendre', 'vouloir'],
    'prix': ['coût', 'tarif', 'combien', 'montant', 'cher', 'budget', 'payer', 'argent', 'dollars', 'usd', 'franc'],
    'formation': ['apprendre', 'cours', 'étudier', 'former', 'stage', 'apprentissage', 'cursus', 'programme', 'enseigner', 'éducation', 'compétence'],
    'machine': ['équipement', 'outil', 'appareil', 'matériel', 'engin', 'dispositif', 'fabriquer'],
    'membre': ['adhésion', 'adhérer', 'rejoindre', 'inscription', 'inscrire', 'appartenir', 'faire partie', 'intégrer'],
    'garantie': ['après-vente', 'réparation', 'maintenance', 'service', 'sav', 'panne', 'casse', 'défaut', 'problème'],
    'livrer': ['livraison', 'expédition', 'transport', 'envoyer', 'recevoir', 'expédier', 'province', 'kinshasa'],
    'certificat': ['certifié', 'certification', 'diplôme', 'reconnu', 'attestation', 'accrédité', 'validé'],
    'contact': ['téléphone', 'email', 'joindre', 'appeler', 'whatsapp', 'numéro', 'adresse', 'où', 'localisation', 'situer'],
    'horaire': ['ouvert', 'heure', 'fermé', 'disponible', 'quand', 'jour', 'lundi', 'mardi', 'semaine'],
    'aide': ['aider', 'besoin', 'cherche', 'comment', 'question', 'renseigner', 'information', 'info', 'savoir'],
    'données': ['confidentialité', 'privacy', 'rgpd', 'protection', 'personnelles', 'vie privée', 'sécurité'],
    'paiement': ['crédit', 'facilité', 'échelonné', 'mensualité', 'financement', 'payer', 'versement', 'modalité'],
    'essayer': ['tester', 'voir', 'showroom', 'visite', 'démonstration', 'demo', 'montrer'],
    'construire': ['construction', 'bâtiment', 'chantier', 'btp', 'maison', 'immeuble', 'ouvrage'],
    'agriculture': ['agricole', 'ferme', 'cultiver', 'récolte', 'grain', 'maïs', 'manioc', 'arachide', 'champ'],
    'boulangerie': ['pain', 'pâtisserie', 'farine', 'pétrin', 'four', 'boulanger'],
    'soudure': ['souder', 'soudeur', 'tig', 'mig', 'arc', 'fer', 'métal', 'métallurgie', 'inox'],
    'électricité': ['électrique', 'câblage', 'courant', 'installation', 'tableau', 'disjoncteur', 'fil', 'électricien'],
    'menuiserie': ['bois', 'meuble', 'ébénisterie', 'menuisier', 'table', 'chaise', 'porte', 'fenêtre', 'armoire', 'placard'],
    'plomberie': ['plombier', 'sanitaire', 'tuyau', 'eau', 'fuite', 'robinet', 'douche', 'toilette'],
    'mécanique': ['mécanicien', 'auto', 'voiture', 'véhicule', 'moteur', 'panne', 'réparation', 'entretien'],
    'sur mesure': ['personnalisé', 'custom', 'spécial', 'adapter', 'adapté', 'conception', 'concevoir', 'fabriquer sur'],
    'histoire': ['fondé', 'fondation', 'créé', 'création', 'existe', 'existence', 'existance', 'année', 'années', 'âge', 'age', 'ancien', 'ancienneté', 'depuis', 'quand', 'date', 'naissance', 'origine', 'début', 'commencement', 'démarrer']
};

// Distance de Levenshtein simplifiée pour le fuzzy matching
function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[b.length][a.length];
}

// Normaliser un texte (accents, minuscules, ponctuation)
function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['']/g, "'")
        .replace(/[^\w\s']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Extraire les mots significatifs (enlever les mots vides)
const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'au', 'aux', 'et', 'ou', 'en', 'a', 'est', 'que', 'qui', 'ce', 'se', 'ne', 'pas', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'on', 'me', 'te', 'son', 'sa', 'ses', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'y', 'pour', 'par', 'sur', 'dans', 'avec', 'mais', 'donc', 'car', 'ni', 'si', 'ca', 'cela', 'tres', 'plus', 'aussi', 'bien', 'cette', 'ces', 'quel', 'quelle', 'quels', 'quelles']);

function extractKeywords(text) {
    const normalized = normalizeText(text);
    return normalized.split(' ').filter(w => w.length > 1 && !stopWords.has(w));
}

// Vérifier si un mot ressemble à un autre (fuzzy)
function fuzzyMatch(word, target) {
    if (word === target) return 1.0;
    if (target.includes(word) || word.includes(target)) return 0.85;

    // Pour les mots courts, exiger une correspondance exacte
    if (word.length < 4 || target.length < 4) return word === target ? 1.0 : 0;

    const dist = levenshtein(word, target);
    const maxLen = Math.max(word.length, target.length);
    const similarity = 1 - (dist / maxLen);
    return similarity >= 0.7 ? similarity : 0;
}

// Trouver des synonymes activés dans le message
function findSynonymMatches(messageWords) {
    const activated = new Set();
    for (const [concept, synonyms] of Object.entries(synonymsMap)) {
        for (const msgWord of messageWords) {
            // Vérifier le concept lui-même
            if (fuzzyMatch(msgWord, normalizeText(concept)) > 0.7) {
                activated.add(concept);
                break;
            }
            // Vérifier chaque synonyme 
            for (const syn of synonyms) {
                const normSyn = normalizeText(syn);
                // Correspondance directe ou partielle
                if (fuzzyMatch(msgWord, normSyn) > 0.7) {
                    activated.add(concept);
                    break;
                }
            }
        }
    }
    return activated;
}

// Recherche intelligente dans la FAQ avec fuzzy matching et synonymes
function searchFAQ(message) {
    const normalizedMsg = normalizeText(message);
    const messageWords = extractKeywords(message);
    const activatedConcepts = findSynonymMatches(messageWords);

    let bestMatch = null;
    let bestScore = 0;

    Object.values(faqData).forEach(category => {
        Object.values(category).forEach(item => {
            let score = 0;
            let matchCount = 0;

            item.keywords.forEach(keyword => {
                const normKeyword = normalizeText(keyword);
                const keywordWords = normKeyword.split(' ');

                // 1. Correspondance exacte (phrase complète)
                if (normalizedMsg.includes(normKeyword)) {
                    score += normKeyword.length * 2;
                    matchCount++;
                    return;
                }

                // 2. Correspondance mot par mot avec fuzzy
                for (const kw of keywordWords) {
                    for (const mw of messageWords) {
                        const sim = fuzzyMatch(mw, kw);
                        if (sim > 0.7) {
                            score += kw.length * sim;
                            matchCount++;
                            break;
                        }
                    }
                }

                // 3. Correspondance via synonymes
                for (const [concept, synonyms] of Object.entries(synonymsMap)) {
                    if (activatedConcepts.has(concept)) {
                        const allRelated = [concept, ...synonyms].map(s => normalizeText(s));
                        if (allRelated.some(s => fuzzyMatch(normKeyword, s) > 0.7 || s.includes(normKeyword) || normKeyword.includes(s))) {
                            score += 3;
                            matchCount++;
                            break;
                        }
                    }
                }
            });

            // Bonus contextuels
            if (matchCount > 1) score += matchCount * 3;
            if (matchCount > 2) score += 8;

            // Bonus si la question elle-même correspond
            const normQuestion = normalizeText(item.question);
            const qWords = extractKeywords(item.question);
            const qMatchCount = qWords.filter(qw => messageWords.some(mw => fuzzyMatch(mw, qw) > 0.7)).length;
            if (qMatchCount >= 2) score += qMatchCount * 4;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = { ...item, confidence: score };
            }
        });
    });

    return bestScore >= 3 ? bestMatch : null;
}

// Recherche de produits avec fuzzy matching
function searchProducts(message, list) {
    const messageWords = extractKeywords(message);
    const activatedConcepts = findSynonymMatches(messageWords);
    let matches = [];

    list.forEach(item => {
        let score = 0;

        // Vérifier les keywords
        item.keywords.forEach(keyword => {
            const normKw = normalizeText(keyword);
            for (const mw of messageWords) {
                if (fuzzyMatch(mw, normKw) > 0.7) {
                    score += 3;
                    break;
                }
            }
            // Vérifier via synonymes
            for (const concept of activatedConcepts) {
                const allRelated = [concept, ...(synonymsMap[concept] || [])].map(s => normalizeText(s));
                if (allRelated.some(s => s.includes(normKw) || normKw.includes(s))) {
                    score += 2;
                    break;
                }
            }
        });

        // Bonus si le nom/titre est mentionné
        const itemName = normalizeText(item.title || item.name || '');
        if (itemName) {
            const nameWords = itemName.split(' ').filter(w => w.length > 2);
            const nameMatchCount = nameWords.filter(nw => messageWords.some(mw => fuzzyMatch(mw, nw) > 0.7)).length;
            score += nameMatchCount * 5;
        }

        if (score > 0) matches.push({ item, score });
    });

    return matches.sort((a, b) => b.score - a.score).map(m => m.item);
}

// Détection d'intention ultra-améliorée
function detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim();
    const normalizedMsg = normalizeText(message);
    const messageWords = extractKeywords(message);
    const activatedConcepts = findSynonymMatches(messageWords);

    // Salutations (élargi)
    if (/^(bonjour|bonsoir|salut|hello|hi|hey|coucou|yo|bjr|slt|bsr|wesh|cc)/.test(lowerMessage) ||
        /^(comment .{0,5}va|ca va|ça va)/.test(normalizedMsg)) {
        return 'salutation';
    }

    // Remerciements (élargi)
    if (/(merci|thank|super|cool|parfait|genial|top|excellent|bravo|formidable|nickel|impeccable|c.est bien|ok merci|d.accord merci)/.test(normalizedMsg)) {
        return 'merci';
    }

    // Au revoir (élargi)
    if (/(au revoir|bye|a bientot|ciao|a plus|tchao|bonne nuit|bonne soiree|a la prochaine|adieu)/.test(normalizedMsg)) {
        return 'aurevoir';
    }

    // Questions sur l'âge / l'existence / la fondation de GAL (AVANT présentation pour capter ces questions spécifiques)
    if (/(combien.*ann|combien.*an|quel.*age|quel.*âge|existe.*depuis|annee.*exist|année.*exist|existance|existence|fonde.*quand|quand.*fonde|quand.*cree|date.*creation|date.*fondation|depuis.*quand|combien.*temps.*exist)/.test(normalizedMsg)) {
        return { type: 'faq', data: faqData.histoire.h1 };
    }
    if (/(qui.*fonde|qui.*cree|fondateur|createur|origine|qui.*derriere|qui.*lance)/.test(normalizedMsg) && /(gal|groupement|artisan|organisation)/.test(normalizedMsg)) {
        return { type: 'faq', data: faqData.histoire.h2 };
    }
    if (/(mission|vocation|role|objectif|but|raison.*etre)/.test(normalizedMsg) && /(gal|vous|votre|groupement|artisan)/.test(normalizedMsg)) {
        return { type: 'faq', data: faqData.histoire.h3 };
    }
    if (/(vision|futur|avenir|ambition|plan|2030|objectif.*futur)/.test(normalizedMsg) && /(gal|vous|votre|groupement|artisan)/.test(normalizedMsg)) {
        return { type: 'faq', data: faqData.histoire.h4 };
    }
    if (/(ou.*situe|ou.*trouve|localisation|adresse|ville|pays|lubumbashi|ou.*etes|ou.*se trouve)/.test(normalizedMsg) && /(gal|vous|votre|groupement|artisan|atelier|showroom|bureau)/.test(normalizedMsg)) {
        return { type: 'faq', data: faqData.histoire.h5 };
    }
    if (/(chiffre|statistique|bilan|resultat|accomplissement|realisation|combien.*machine.*livre|combien.*membre|combien.*expert)/.test(normalizedMsg)) {
        return { type: 'faq', data: faqData.histoire.h6 };
    }

    // Présentation GAL (élargi)
    if (/(qui etes|c.est quoi gal|presentation|a propos|qu.est.ce que|parlez.moi de|dites.moi|decrire|decriv|histoire)/.test(normalizedMsg) &&
        /(gal|vous|organisation|association|groupement|artisan)/.test(normalizedMsg)) {
        return 'presentation';
    }
    if (/(c.est quoi|qu.est.ce que|qui est|presente|definir)/.test(normalizedMsg) && /(gal|groupement|artisan)/.test(normalizedMsg)) {
        return 'presentation';
    }

    // Contact (élargi)
    if (activatedConcepts.has('contact') || /(contacter|joindre|appeler|ecrire|coordonnee|adresse|localisation|situe|trouv|aller|venir|visit|rendez.vous)/.test(normalizedMsg)) {
        // Seulement si la question porte sur le contact, pas sur une visite de machine
        if (!activatedConcepts.has('machine') && !activatedConcepts.has('essayer')) {
            return 'contact';
        }
    }

    // Horaires (élargi)
    if (activatedConcepts.has('horaire') || /(horaire|ouvert|heure|ferme|disponib|quand.*ouv|jour.*ouv|ouvrir)/.test(normalizedMsg)) {
        if (!/(formation|cours|session)/.test(normalizedMsg)) {
            return 'horaires';
        }
    }

    // Vidéos
    if (/(video|youtube|regarder|chaine|tutoriel|demo|demonstration)/.test(normalizedMsg)) {
        const faqMatch = searchFAQ(message);
        if (faqMatch && normalizeText(faqMatch.question).includes('video')) {
            return { type: 'faq', data: faqMatch };
        }
        return 'videos_link';
    }

    // Rechercher dans la FAQ (principal)
    const faqMatch = searchFAQ(message);
    if (faqMatch && faqMatch.confidence >= 5) {
        return { type: 'faq', data: faqMatch };
    }

    // Rechercher dans les données DYNAMIQUES
    const dynamicMatch = searchDynamicData(message);
    if (dynamicMatch) return dynamicMatch;

    // Recherche dans les listes statiques
    const formationMatches = searchProducts(message, formationsList);
    if (formationMatches.length > 0) {
        return { type: 'formation_info', data: formationMatches[0] };
    }

    const machineMatches = searchProducts(message, machinesList);
    if (machineMatches.length > 0) {
        return { type: 'machine_info', data: machineMatches[0] };
    }

    // FAQ avec seuil plus bas en dernier recours
    if (faqMatch && faqMatch.confidence >= 3) {
        return { type: 'faq', data: faqMatch };
    }

    // Détection sémantique de dernier recours via concepts activés
    if (activatedConcepts.size > 0) {
        // Si on parle de formation/apprentissage
        if (activatedConcepts.has('formation') || activatedConcepts.has('certificat')) {
            return { type: 'topic_formations', concepts: activatedConcepts };
        }
        // Si on parle de machines/outils
        if (activatedConcepts.has('machine') || activatedConcepts.has('acheter') || activatedConcepts.has('agriculture') || activatedConcepts.has('construire') || activatedConcepts.has('boulangerie')) {
            return { type: 'topic_machines', concepts: activatedConcepts };
        }
        // Si on parle d'adhésion
        if (activatedConcepts.has('membre') || activatedConcepts.has('prix')) {
            return { type: 'topic_adhesion', concepts: activatedConcepts };
        }
        // Si on parle de données/privacy
        if (activatedConcepts.has('données')) {
            return { type: 'topic_privacy', concepts: activatedConcepts };
        }
        // Si on parle de paiement
        if (activatedConcepts.has('paiement')) {
            return { type: 'topic_paiement', concepts: activatedConcepts };
        }
        // Si on parle de garantie/SAV
        if (activatedConcepts.has('garantie')) {
            return { type: 'topic_garantie', concepts: activatedConcepts };
        }
        // Si on parle d'un métier spécifique
        for (const metier of ['soudure', 'électricité', 'menuiserie', 'plomberie', 'mécanique']) {
            if (activatedConcepts.has(metier)) {
                return { type: 'topic_metier', metier, concepts: activatedConcepts };
            }
        }
        // Si on parle de sur mesure / conception
        if (activatedConcepts.has('sur mesure')) {
            return { type: 'topic_surmesure', concepts: activatedConcepts };
        }
        // Si on parle d'histoire / fondation / âge
        if (activatedConcepts.has('histoire')) {
            return { type: 'faq', data: faqData.histoire.h1 };
        }
    }

    // Small Talk : Comment vas-tu ?
    if (/(comment.*va.*tu|comment.*allez.*vous|ca.*va|ça.*va|tu.*va.*bien|tout.*va.*bien)/.test(normalizedMsg)) {
        return 'small_talk_mood';
    }

    // Small Talk : Qui t'a créé ?
    if (/(qui.*ta.*cree|qui.*t.a.*cree|qui.*est.*ton.*createur|qui.*ta.*fait|comment.*tu.*existe|tu.*es.*qui|qui.*es.*tu)/.test(normalizedMsg)) {
        return 'small_talk_identity';
    }

    // Small Talk : Tu es intelligent / Tu es bête
    if (/(tu.*es.*intelligent|tu.*es.*cool|tu.*es.*top|tu.*es.*genial|tu.*es.*bete|tu.*es.*idiot|nul)/.test(normalizedMsg)) {
        return 'small_talk_compliment';
    }

    return 'default';
}


// Génération de réponse humaine
function generateHumanResponse(intent) {
    const hour = new Date().getHours();
    let response = "";

    // Ajouter une expression de réflexion parfois
    if (Math.random() > 0.7) {
        const thinking = humanExpressions.thinking[Math.floor(Math.random() * humanExpressions.thinking.length)];
        response += thinking + "\n\n";
    }

    switch (intent) {
        case 'salutation':
            const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
            const greeting = greetings[timeOfDay][Math.floor(Math.random() * greetings[timeOfDay].length)];
            response += `${greeting} 🤝\n\nJe suis Dan Kande, l'assistant virtuel de GAL. Ravi de vous rencontrer.\n\nComment puis-je vous assister aujourd'hui ? Je peux vous renseigner sur nos formations, machines, ou l'adhésion à GAL. ⚙️`;
            break;

        case 'merci':
            const thanks = emotionalResponses.merci[Math.floor(Math.random() * emotionalResponses.merci.length)];
            response += thanks;

            if (Math.random() > 0.5) {
                response += "\n\nVous avez d'autres questions ? Je reste à votre disposition !";
            }
            break;

        case 'aurevoir':
            response += "Au revoir ! 🤝\n\nCe fut un plaisir d'échanger avec vous. N'hésitez pas à revenir pour toute autre demande.\n\nÀ très bientôt chez GAL. 🚀";
            break;

        case 'presentation':
            const empathy = humanExpressions.empathy[Math.floor(Math.random() * humanExpressions.empathy.length)];
            const currentYear = new Date().getFullYear();
            const ageGAL = currentYear - knowledge.gal.fondation;
            response += `${empathy}. ✅\n\n`;
            response += `${knowledge.gal.about}\n\n`;
            response += `📍 **Lieu** : ${knowledge.gal.lieu}\n`;
            response += `📅 **Fondé en** : ${knowledge.gal.fondation} (${ageGAL > 0 ? ageGAL + ' an(s)' : 'cette année'})\n`;
            response += `👥 **Membres** : ${knowledge.gal.stats.members} artisans\n`;
            response += `⚙️ **Machines livrées** : ${knowledge.gal.stats.machines_livrees}\n`;
            response += `🎯 **Projets** : ${knowledge.gal.stats.projects}\n\n`;
            response += `💡 *"${knowledge.gal.philosophie}"*\n\n`;
            response += "Souhaitez-vous des détails supplémentaires ?";
            break;

        case 'small_talk_mood':
            response += "Je vais à merveille, merci de demander ! 😊\n\nPrêt et disponible pour vous aider dans vos recherches sur GAL. Et de votre côté, comment puis-je faciliter votre journée ?";
            break;

        case 'small_talk_identity':
            response += "Je suis Dan Kande, l'assistant numérique de GAL. 🤖\n\nJ'ai été conçu par l'équipe technique de GAL pour répondre instantanément à vos questions 24h/24. Je n'ai pas de corps physique, mais j'ai une connaissance approfondie de tout notre catalogue !";
            break;

        case 'small_talk_compliment':
            if (/(intelligent|cool|top|genial)/.test(intent)) {
                response += "C'est vraiment gentil de votre part ! 😊 Je fais de mon mieux pour être aussi utile que possible. Merci pour ce compliment !";
            } else {
                response += "Ouch ! Je suis désolé si je n'ai pas répondu à vos attentes. 😔 Je suis encore en plein apprentissage. N'hésitez pas à reformuler votre question ou à contacter nos experts humains !";
            }
            break;

        case 'contact':
            response += "Bien sûr. Voici nos coordonnées : 📱\n\n";
            response += `• **Téléphone** : ${knowledge.gal.contact.phone}\n`;
            response += `• **Email** : ${knowledge.gal.contact.email}\n`;
            response += `• **WhatsApp** : wa.me/${knowledge.gal.contact.whatsapp}\n\n`;
            response += "Notre équipe est disponible du lundi au vendredi, de 8h à 17h. Pour une réponse rapide, privilégiez WhatsApp. 💬";
            break;

        case 'horaires':
            response += "Nos horaires d'ouverture sont les suivants : 🕒\n\n";
            response += "• **Lundi - Vendredi** : 8h - 17h\n";
            response += "• **Week-end** : Fermé\n\n";
            response += "Pour toute urgence, vous pouvez nous laisser un message sur WhatsApp. 📱";
            break;

        case 'videos_link':
            response += "Vous cherchez nos vidéos ? 🎥\n\n";
            response += "Vous pouvez consulter notre galerie vidéo complète sur la page 'Vidéos' de notre site. Vous y trouverez des démonstrations de machines et des tutoriels.\n\n";
            response += "Souhaitez-vous que je vous envoie le lien vers notre chaîne YouTube ?";
            break;

        case 'default':
            response += "Je ne suis pas certain de saisir votre demande. 🧐\n\n";
            response += "Je peux toutefois vous assister sur ces sujets :\n\n";
            response += "💼 **Adhésion à GAL**\n";
            response += "🎖️ **Formations certifiantes**\n";
            response += "⚙️ **Catalogue de machines**\n";
            response += "📱 **Coordonnées et horaires**\n\n";
            response += "Pourriez-vous reformuler ou choisir un thème ? ✅";
            break;

        default:
            // Réponse FAQ
            if (intent.type === 'faq' && intent.data) {
                const agreement = humanExpressions.agreement[Math.floor(Math.random() * humanExpressions.agreement.length)];

                if (intent.data.confidence < 8) {
                    response += `Si j'ai bien compris, vous souhaitez savoir : *"${intent.data.question}"* ? 😊\n\n`;
                } else {
                    response += `${agreement} Concernant **${intent.data.question.replace('?', '')}** :\n\n`;
                }

                let answerText = intent.data.answer;
                if (intent.data.answers && intent.data.answers.length > 0) {
                    answerText = intent.data.answers[Math.floor(Math.random() * intent.data.answers.length)];
                }

                response += answerText;

                const closing = humanExpressions.closing[Math.floor(Math.random() * humanExpressions.closing.length)];
                response += `\n\n${closing}`;
            }
            // Réponse Dynamique : Machine
            else if (intent.type === 'machine_dynamic' && intent.data) {
                const m = intent.data;
                response += `Je pense que vous faites référence à notre machine **${m.name}**. ⚙️\n\n`;
                response += `• **Catégorie** : ${m.category || 'Non spécifiée'}\n`;
                response += `• **Prix** : ${m.price || 'Sur devis'}\n`;
                response += `• **Description** : ${m.description || 'Nous fabriquons cette machine avec précision dans nos ateliers.'}\n\n`;
                if (m.specs) response += `🛠️ **Spécifications** : ${m.specs}\n\n`;
                response += "C'est l'un de nos produits phares. Souhaitez-vous que je vérifie sa disponibilité immédiate pour vous ?";
            }
            // Réponse Dynamique : Formation
            else if (intent.type === 'formation_dynamic' && intent.data) {
                const f = intent.data;
                response += `Vous parlez sans doute de la formation **${f.title}**. 🎓\n\n`;
                response += `• **Niveau** : ${f.level || 'Tous niveaux'}\n`;
                response += `• **Durée** : ${f.duration || 'Variable'}\n`;
                response += `• **Description** : ${f.description || 'Une formation complète pour booster vos compétences.'}\n\n`;
                response += "C'est une excellente opportunité pour vous perfectionner. Souhaitez-vous connaître les dates de la prochaine session ?";
            }
            // Réponse Dynamique : Projet
            else if (intent.type === 'project_dynamic' && intent.data) {
                const p = intent.data;
                response += `Ah, vous voulez des informations sur le projet **${p.title}** ? C'est une de nos réalisations récentes ! 🏗️\n\n`;
                response += `${p.description}\n\n`;
                response += `Ce projet est classé comme : ${p.type === 'chantier' ? 'Chantier en cours' : 'Conception architecturale'}.\n\n`;
                response += "Cela vous donne une idée de la qualité de travail que nous pouvons fournir. Vous avez un projet similaire en tête ?";
            }
            // Réponse Dynamique : Blog
            else if (intent.type === 'blog_dynamic' && intent.data) {
                const b = intent.data;
                response += `J'ai trouvé un article de blog qui semble correspondre à votre recherche : **${b.title}**. 📝\n\n`;
                response += `${b.excerpt || b.description || 'Un article passionnant sur notre expertise.'}\n\n`;
                response += `Publié par ${b.author || 'le GAL'}.\n\n`;
                response += "C'est une lecture très instructive. Voulez-vous que je vous guide vers la section Blog pour lire l'intégralité ?";
            }
            // ===== RÉPONSES SÉMANTIQUES PAR THÈME =====
            else if (intent.type === 'topic_formations') {
                response += "Vous vous intéressez à nos formations ? Excellent choix ! 🎓\n\n";
                response += "Chez GAL, nous proposons plusieurs formations certifiantes :\n\n";
                response += "• **Électricité industrielle** — Installation et normes de sécurité\n";
                response += "• **Soudure et métallurgie** — Techniques TIG, MIG et arc\n";
                response += "• **Menuiserie professionnelle** — Conception et réalisation\n";
                response += "• **Plomberie sanitaire** — Systèmes complets\n";
                response += "• **Mécanique automobile** — Diagnostic et réparation\n";
                response += "• **Gestion de chantier** — Management de projets BTP\n\n";
                response += "Toutes nos formations délivrent un **certificat reconnu**. Les membres bénéficient de **30% de réduction** sur les tarifs.\n\n";
                response += "Quelle formation vous intéresse le plus ? 😊";
            }
            else if (intent.type === 'topic_machines') {
                response += "Vous cherchez du matériel ? Nous avons un catalogue varié ! ⚙️\n\n";
                response += "Voici quelques-unes de nos machines phares :\n\n";
                response += "🌾 **Agriculture** : Batteuse à maïs, Rapeuse à manioc, Presse à huile\n";
                response += "🏗️ **Construction** : Moules blocs ciment, Moules buses béton, Brouettes renforcées\n";
                response += "🍞 **Boulangerie** : Pétrins professionnels\n";
                response += "⚡ **Électrique** : Coffrets métalliques sur mesure\n\n";
                response += "Nous proposons aussi la **fabrication sur mesure** selon vos besoins. Les prix varient, contactez-nous pour un devis personnalisé.\n\n";
                response += "Quel type de machine recherchez-vous ? Je peux être plus précis ! 🔍";
            }
            else if (intent.type === 'topic_adhesion') {
                response += "Vous souhaitez en savoir plus sur l'adhésion à GAL ? 💼\n\n";
                response += "Voici les informations essentielles :\n\n";
                response += "• **Cotisation** : 50 USD/an\n";
                response += "• **Conditions** : Être artisan actif dans la région\n\n";
                response += "**Avantages exclusifs** :\n";
                response += "✅ Réductions de 30% sur les formations\n";
                response += "✅ Prix préférentiels sur les machines\n";
                response += "✅ Réseau de " + knowledge.gal.stats.members + " artisans professionnels\n";
                response += "✅ Événements de networking trimestriels\n";
                response += "✅ Accompagnement personnalisé\n\n";
                response += `Pour adhérer, contactez-nous via **WhatsApp** : wa.me/${knowledge.gal.contact.whatsapp} 📱`;
            }
            else if (intent.type === 'topic_privacy') {
                response += "Votre vie privée est importante pour nous. 🔒\n\n";
                response += "• Nous collectons uniquement les données nécessaires (nom, email, téléphone)\n";
                response += "• Vos informations ne sont **jamais vendues** à des tiers\n";
                response += "• Vous pouvez demander la **suppression** de vos données à tout moment\n";
                response += "• Nous utilisons uniquement des cookies essentiels\n\n";
                response += `Pour toute demande, écrivez à **${knowledge.gal.contact.email}** 📧`;
            }
            else if (intent.type === 'topic_paiement') {
                response += "Concernant les modalités de paiement : 💰\n\n";
                response += "Nous proposons plusieurs options pour faciliter vos achats :\n\n";
                response += "• **Paiement comptant** — Le prix standard\n";
                response += "• **Paiement échelonné** — Selon votre profil et le montant\n";
                response += "• **Facilités de crédit** — Pour les membres GAL\n\n";
                response += "Pour obtenir un devis personnalisé et discuter des conditions de paiement, contactez notre équipe. Nous nous adaptons à vos besoins ! 🤝";
            }
            else if (intent.type === 'topic_garantie') {
                response += "Concernant la garantie et le service après-vente : 🛡️\n\n";
                response += "Nous offrons un **SAV complet** :\n\n";
                response += "• **Garantie** : 1 à 2 ans selon la machine\n";
                response += "• **Couverture** : Défauts de fabrication et pièces mécaniques\n";
                response += "• **Pièces de rechange** : Disponibles en stock\n";
                response += "• **Assistance technique** : Notre équipe d'experts à votre service\n\n";
                response += "La garantie ne couvre pas l'usure normale ni les dommages liés à une mauvaise utilisation. N'hésitez pas à nous contacter pour plus de détails ! ⚙️";
            }
            else if (intent.type === 'topic_metier') {
                const metierInfo = {
                    'soudure': { icon: '🔥', title: 'Soudure et Métallurgie', desc: "Nous proposons une formation complète en soudure (TIG, MIG, arc) avec certification. Nous avons aussi le matériel de soudure disponible." },
                    'électricité': { icon: '⚡', title: 'Électricité Industrielle', desc: "Notre formation en électricité industrielle couvre l'installation, le câblage et les normes de sécurité. Nous fabriquons aussi des coffrets électriques." },
                    'menuiserie': { icon: '🪵', title: 'Menuiserie Professionnelle', desc: "De la conception à la réalisation, notre formation en menuiserie vous rend autonome. Nous pouvons aussi vous équiper en machines à bois." },
                    'plomberie': { icon: '🔧', title: 'Plomberie Sanitaire', desc: "Formation complète sur tous les systèmes de plomberie et sanitaires, avec certification professionnelle." },
                    'mécanique': { icon: '🔩', title: 'Mécanique Automobile', desc: "Diagnostic, réparation et entretien de tous types de véhicules. Formation de niveau professionnel avec certification." }
                };
                const info = metierInfo[intent.metier] || { icon: '🏭', title: intent.metier, desc: "Nous proposons des formations et du matériel dans ce domaine." };
                response += `Vous vous intéressez au domaine de la **${info.title}** ! ${info.icon}\n\n`;
                response += `${info.desc}\n\n`;
                response += "Chez GAL, nous combinons **formation + équipement** pour vous permettre de démarrer ou développer votre activité artisanale.\n\n";
                response += "Souhaitez-vous plus de détails sur la formation, les machines disponibles, ou les deux ? 😊";
            }
            else if (intent.type === 'topic_surmesure') {
                response += "Vous avez besoin d'une solution sur mesure ? C'est notre spécialité ! 🎯\n\n";
                response += "Nos ingénieurs peuvent **concevoir et fabriquer** une machine adaptée exactement à vos besoins :\n\n";
                response += "• Analyse de vos besoins spécifiques\n";
                response += "• Conception technique détaillée\n";
                response += "• Fabrication dans nos ateliers\n";
                response += "• Tests et mise en service\n";
                response += "• Formation à l'utilisation incluse\n\n";
                response += `Contactez-nous pour en discuter : **${knowledge.gal.contact.phone}** ou WhatsApp 📱`;
            }
            break;
    }

    return response;
}

// Message de bienvenue personnalisé
function getWelcomeMessage() {
    return getGeminiWelcome();
}

// Simulation de frappe réaliste
function simulateTyping(text, callback) {
    const typingSpeed = 30 + Math.random() * 40; // Vitesse variable
    callback(text);
}

// Injection du HTML du chatbot avec z-index de sécurité et sans wrapper bloquant
function injectChatbotHTML() {
    if (document.getElementById('chatbot-widget')) return;
    console.log('🏗️ Injection du HTML de Dan Kande...');

    const html = `
        <div id="chatbot-widget" class="fixed bottom-6 right-6 z-[99999] flex flex-col items-end font-sans" style="z-index: 99999; pointer-events: none;">
            <!-- Fenêtre de chat -->
            <div id="assistant-chat" class="hidden bg-white w-[90vw] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 transform origin-bottom-right mb-4 shadow-red-900/10" style="pointer-events: auto;">
                <!-- En-tête -->
                <div class="bg-red-700 p-4 flex justify-between items-center text-white">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-700 font-bold text-xl border-2 border-red-200">
                                D
                            </div>
                            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-red-700"></div>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg leading-tight">Dan Kande</h3>
                            <p class="text-xs text-red-100 opacity-90">Assistant GAL • En ligne</p>
                        </div>
                    </div>
                    <button id="close-assistant" class="text-white hover:bg-red-600 p-2 rounded-full transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Zone de messages -->
                <div id="messages-container" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
                    <!-- Les messages seront injectés ici -->
                </div>

                <!-- Zone de saisie -->
                <div class="p-4 bg-white border-t border-gray-100">
                    <form id="chat-form" class="flex gap-2">
                        <input type="text" id="chat-input" 
                            class="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:bg-white transition-all shadow-inner"
                            placeholder="Posez votre question..." autocomplete="off">
                        <button type="submit" 
                            class="bg-red-700 text-white p-3 rounded-full hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex-shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                    <div class="text-center mt-2">
                        <button id="human-support-btn" class="text-xs text-gray-400 hover:text-red-700 underline transition-colors">
                            Parler à un humain sur WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            <!-- Bouton d'ouverture -->
            <button id="assistant-button" 
                class="bg-red-700 hover:bg-red-800 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-3 group" 
                style="pointer-events: auto; z-index: 100000;">
                <span class="hidden group-hover:block text-sm font-bold pr-2 transition-all">Besoin d'aide ?</span>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    console.log('✅ Dan Kande a été injecté dans le body.');
}

// Initialisation du chatbot
async function initChatbotStandalone() {
    console.log('🤖 Tentative d\'initialisation du chatbot Dan Kande...');

    try {
        // 1. Injecter le HTML immédiatement
        if (!document.getElementById('assistant-button')) {
            injectChatbotHTML();
            console.log('✅ HTML du chatbot injecté');
        }

        // 2. Charger les données en arrière-plan (ne doit pas bloquer l'affichage)
        loadAllSiteData()
            .then(() => console.log('🧠 Données dynamiques chargées pour le chatbot'))
            .catch(err => console.error('❌ Erreur chargement données chatbot:', err));

        const assistantButton = document.getElementById('assistant-button');
        const closeAssistant = document.getElementById('close-assistant');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('messages-container');
        const assistantChat = document.getElementById('assistant-chat');
        const humanSupportBtn = document.getElementById('human-support-btn');

        if (!assistantButton || !closeAssistant || !chatForm) {
            console.warn('⚠️ Éléments du chatbot non trouvés même après injection');
            return;
        }

        let isTyping = false;
        let messageCount = 0;

        // Ouvrir le chat
        assistantButton.addEventListener('click', () => {
            assistantButton.classList.add('hidden');
            assistantChat.classList.remove('hidden');
            setTimeout(() => chatInput?.focus(), 300);
        });

        // Fermer le chat
        closeAssistant.addEventListener('click', () => {
            assistantChat.classList.add('hidden');
            assistantButton.classList.remove('hidden');
        });

        // Parler à un humain
        if (humanSupportBtn) {
            humanSupportBtn.addEventListener('click', () => {
                window.open('https://wa.me/243979022998', '_blank');
            });
        }

        // Message de bienvenue
        updateWelcomeMessage();

        // Gérer l'envoi de messages
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const query = chatInput.value.trim();
            if (!query || isTyping) return;

            messageCount++;

            // Ajouter message utilisateur
            addMessage('user', query);
            chatInput.value = '';

            // Indicateur de frappe
            isTyping = true;
            showTypingIndicator();

            // Obtenir la réponse de Google Gemini
            try {
                const response = await getBotResponse(query);
                
                hideTypingIndicator();
                addMessage('bot', response);
                isTyping = false;

                // Suggérer la FAQ après quelques messages
                if (messageCount === 3 && Math.random() > 0.6) {
                    setTimeout(() => {
                        addMessage('bot', "💡 **Information** : N'hésitez pas à consulter notre page FAQ si vous avez des questions générales. 📑");
                    }, 2000);
                }
            } catch (error) {
                console.error("Erreur Gemini:", error);
                hideTypingIndicator();
                addMessage('bot', "Désolé, je rencontre des difficultés techniques pour vous répondre en ce moment. Pouvez-vous reformuler ?");
                isTyping = false;
            }
        });

        function updateWelcomeMessage() {
            if (!messagesContainer) return;

            const welcomeText = getWelcomeMessage();
            const suggestions = [
                { label: "⚙️ Voir nos machines", query: "Je veux voir vos machines" },
                { label: "🎓 Les formations", query: "Quelles formations proposez-vous ?" },
                { label: "🤝 Devenir membre", query: "Comment devenir membre de GAL ?" }
            ];

            addMessage('bot', welcomeText, suggestions);
        }

        function addMessage(role, text, suggestions = []) {
            if (!messagesContainer) return;

            // Nettoyer les suggestions précédentes dans le conteneur
            const oldSuggestions = messagesContainer.querySelectorAll('.suggestions-container');
            oldSuggestions.forEach(s => s.remove());

            const messageDiv = document.createElement('div');
            messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up mb-3`;

            const bubble = document.createElement('div');
            bubble.className = `max-w-[85%] p-3 text-sm font-medium rounded-2xl shadow-sm ${role === 'user'
                ? 'bg-red-700 text-white rounded-tr-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`;

            const textEl = document.createElement('div');
            textEl.className = 'whitespace-pre-wrap leading-relaxed';

            // Support du markdown amélioré
            const formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                .replace(/• (.*?)\n/g, '<li class="ml-4 list-disc">$1</li>')
                .replace(/\n/g, '<br>');

            textEl.innerHTML = formattedText;

            bubble.appendChild(textEl);
            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);

            // Ajouter les suggestions si présentes
            if (suggestions && suggestions.length > 0 && role === 'bot') {
                const suggContainer = document.createElement('div');
                suggContainer.className = 'suggestions-container flex flex-wrap gap-2 mt-2 mb-4 animate-fade-in';

                suggestions.forEach(s => {
                    const btn = document.createElement('button');
                    btn.className = 'bg-white border border-red-100 text-red-700 hover:bg-red-50 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95';
                    btn.textContent = s.label;
                    btn.onclick = () => {
                        chatInput.value = s.query;
                        chatForm.dispatchEvent(new Event('submit'));
                    };
                    suggContainer.appendChild(btn);
                });

                messagesContainer.appendChild(suggContainer);
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function showTypingIndicator() {
            if (!messagesContainer) return;

            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'flex justify-start mb-3';
            typingDiv.innerHTML = `
            <div class="bg-white p-3 shadow-sm border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-2">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-red-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-red-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-red-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                    <span class="text-xs text-gray-500 italic">Dan Kande écrit...</span>
                </div>
            </div>
        `;

            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        }

        console.log('✅ Dan Kande (chatbot GAL) est prêt à discuter !');
    } catch (error) {
        console.error('❌ Échec critique de l\'initialisation du chatbot:', error);
    }
}

// Initialiser après chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotStandalone);
} else {
    setTimeout(initChatbotStandalone, 300);
}
