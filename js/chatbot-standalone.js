/**
 * Chatbot intelligent GAL - Version ultra-réaliste
 * Connecté à la FAQ et avec une personnalité humaine
 */

// Import des questions FAQ (simulé depuis i18n)
// Ces données servent de fallback si Supabase n'est pas disponible
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
    }
};

// Données détaillées des produits et services
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
        about: "Nous sommes une association professionnelle qui regroupe plus de 150 artisans qualifiés à Lubumbashi. Depuis plus de 10 ans, nous accompagnons nos membres dans leur développement professionnel.",
        contact: {
            phone: "+243 979 022 998",
            email: "contact@gal-lubumbashi.com",
            whatsapp: "243979022998"
        },
        stats: {
            members: "150+",
            projects: "500+",
            experience: "10+"
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

// Charger les connaissances depuis Supabase
async function loadKnowledgeFromSupabase() {
    try {
        // Import dynamique pour éviter les erreurs de module dans les scripts classiques
        const { getCollection } = await import('./supabase-service.js');

        const data = await getCollection('chatbot_knowledge');
        if (data && data.length > 0) {
            console.log('🧠 Connaissances chargées depuis Supabase:', data.length, 'entrées');

            // Convertir les données Supabase au format faqData
            // On crée une catégorie 'supabase' pour y mettre tout ce qui vient de la DB
            if (!faqData.supabase) faqData.supabase = {};

            data.forEach(item => {
                // Parsing des JSON si nécessaire
                let keywords = item.patterns;
                let answers = item.responses;

                if (typeof keywords === 'string') {
                    try { keywords = JSON.parse(keywords); } catch (e) { keywords = [keywords]; }
                }

                if (typeof answers === 'string') {
                    try { answers = JSON.parse(answers); } catch (e) { answers = [answers]; }
                }

                // On prend une réponse au hasard si plusieurs sont disponibles
                const answer = Array.isArray(answers) ? answers[0] : answers;

                faqData.supabase[item.tag] = {
                    keywords: Array.isArray(keywords) ? keywords : [keywords],
                    question: item.tag, // On utilise le tag comme question par défaut
                    answer: answer,
                    answers: Array.isArray(answers) ? answers : [answer] // On garde toutes les réponses possibles
                };
            });
        }
    } catch (error) {
        console.warn('⚠️ Impossible de charger les connaissances depuis Supabase, utilisation du fallback local.', error);
    }
}

// Recherche intelligente dans la FAQ
function searchFAQ(message) {
    const lowerMessage = message.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    let bestMatch = null;
    let bestScore = 0;

    // Parcourir toutes les catégories et questions
    Object.values(faqData).forEach(category => {
        Object.values(category).forEach(item => {
            let score = 0;

            // Compter les mots-clés correspondants
            item.keywords.forEach(keyword => {
                const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (lowerMessage.includes(normalizedKeyword)) {
                    score += normalizedKeyword.length;
                }
            });

            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        });
    });

    return bestScore > 2 ? bestMatch : null;
}

// Recherche de produits (Formations ou Machines)
function searchProducts(message, list) {
    const lowerMessage = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let matches = [];

    list.forEach(item => {
        let score = 0;
        item.keywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) score += 2;
        });
        // Bonus si le nom est présent
        if (item.title && lowerMessage.includes(item.title.toLowerCase())) score += 5;
        if (item.name && lowerMessage.includes(item.name.toLowerCase())) score += 5;

        if (score > 0) {
            matches.push({ item, score });
        }
    });

    return matches.sort((a, b) => b.score - a.score).map(m => m.item);
}

// Détection d'intention améliorée
function detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim();

    // Salutations
    if (/^(bonjour|bonsoir|salut|hello|hi|hey|coucou)/.test(lowerMessage)) {
        return 'salutation';
    }

    // Remerciements
    if (/(merci|thank|super|cool|parfait|génial|top|excellent)/.test(lowerMessage)) {
        return 'merci';
    }

    // Au revoir
    if (/(au revoir|bye|à bientôt|ciao|à plus|tchao)/.test(lowerMessage)) {
        return 'aurevoir';
    }

    // Présentation
    if (/(qui êtes|c'est quoi gal|présentation|à propos|qu'est-ce que)/.test(lowerMessage)) {
        return 'presentation';
    }

    // Contact
    if (/(contact|téléphone|email|joindre|appeler|whatsapp|numéro)/.test(lowerMessage)) {
        return 'contact';
    }

    // Horaires
    if (/(horaire|ouvert|heure|quand|disponible|fermé)/.test(lowerMessage)) {
        return 'horaires';
    }

    // Vidéos
    if (/(vidéo|video|youtube|regarder|voir)/.test(lowerMessage)) {
        // On laisse la FAQ gérer si c'est une question spécifique, sinon on renvoie vers la page vidéo
        const faqMatch = searchFAQ(message);
        if (faqMatch && faqMatch.question.includes('vidéo')) {
            return { type: 'faq', data: faqMatch };
        }
        return 'videos_link';
    }

    // Rechercher dans la FAQ
    const faqMatch = searchFAQ(message);
    if (faqMatch) {
        return { type: 'faq', data: faqMatch };
    }

    // Recherche Formations
    const formationMatches = searchProducts(message, formationsList);
    if (formationMatches.length > 0) {
        return { type: 'formation_info', data: formationMatches[0] };
    }

    // Recherche Machines
    const machineMatches = searchProducts(message, machinesList);
    if (machineMatches.length > 0) {
        return { type: 'machine_info', data: machineMatches[0] };
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
            response += `${empathy}. ✅\n\n${knowledge.gal.about}\n\nNous sommes fiers de notre communauté professionnelle. Avec ${knowledge.gal.stats.members} artisans membres et ${knowledge.gal.stats.projects} projets réalisés, nous contribuons activement au développement régional.\n\nSouhaitez-vous des détails supplémentaires ?`;
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

                // Si on a plusieurs réponses possibles (depuis Supabase), on en choisit une au hasard
                let answerText = intent.data.answer;
                if (intent.data.answers && intent.data.answers.length > 0) {
                    answerText = intent.data.answers[Math.floor(Math.random() * intent.data.answers.length)];
                }

                response += `${agreement} ${intent.data.question}\n\n`;
                response += answerText;

                const closing = humanExpressions.closing[Math.floor(Math.random() * humanExpressions.closing.length)];
                response += `\n\n${closing}`;
            }
            // Réponse Formation
            else if (intent.type === 'formation_info' && intent.data) {
                response += `Excellente question. Voici les détails sur notre formation **${intent.data.title}** : 🎖️\n\n`;
                response += `${intent.data.description}\n\n`;
                response += `⏱️ **Durée/Niveau** : ${intent.data.duration}\n\n`;
                response += "Souhaitez-vous procéder à l'inscription ou recevoir le programme détaillé ? Je peux vous mettre en relation avec le responsable pédagogique.";
            }
            // Réponse Machine
            else if (intent.type === 'machine_info' && intent.data) {
                response += `La **${intent.data.name}** est un équipement de choix. ⚙️\n\n`;
                response += `💳 **Prix estimatif** : ${intent.data.price}\n`;
                response += `✅ **Disponibilité** : ${intent.data.status}\n`;
                response += `📑 **Caractéristiques** : ${intent.data.specs}\n\n`;

                if (intent.data.status === 'Disponible') {
                    response += "Cet équipement étant disponible, vous pouvez le voir à notre atelier. Souhaitez-vous que je prépare un bon de commande ?";
                } else {
                    response += "C'est une machine sur commande. Nous pouvons la fabriquer selon vos spécifications. Souhaitez-vous un devis personnalisé ?";
                }
            }
            break;
    }

    return response;
}

// Message de bienvenue personnalisé
function getWelcomeMessage() {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const greeting = greetings[timeOfDay][Math.floor(Math.random() * greetings[timeOfDay].length)];

    const welcomeMessages = [
        `${greeting} Je suis Dan Kande, votre assistant GAL. 🤝\n\nJe maîtrise l'ensemble de nos formations, machines et services. Je suis à votre écoute.`,
        `${greeting} 🤝\n\nIci Dan Kande. Je suis là pour vous orienter chez GAL. Quelle est votre demande ?`,
        `${greeting}.\n\nAssistant virtuel Dan Kande à votre service. Je peux vous renseigner sur GAL, nos formations et nos machines. En quoi puis-je vous être utile ?`
    ];

    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}

// Simulation de frappe réaliste
function simulateTyping(text, callback) {
    const typingSpeed = 30 + Math.random() * 40; // Vitesse variable
    const words = text.split(' ');
    let currentText = '';
    let wordIndex = 0;

    // Pour une réponse instantanée, on retourne directement
    callback(text);
}

// Injection du HTML du chatbot
function injectChatbotHTML() {
    if (document.getElementById('chatbot-widget')) return;

    const html = `
        <div id="chatbot-widget" class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            <!-- Fenêtre de chat -->
            <div id="assistant-chat" class="hidden bg-white w-[90vw] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 transform origin-bottom-right mb-4">
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
                            class="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:bg-white transition-all"
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
                class="bg-red-700 hover:bg-red-800 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-3 group">
                <span class="hidden group-hover:block text-sm font-bold pr-2">Besoin d'aide ?</span>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
}

// Initialisation du chatbot
async function initChatbotStandalone() {
    console.log('🤖 Initialisation du chatbot humain GAL (Dan Kande)...');

    // 1. Injecter le HTML immédiatement pour que le bouton apparaisse
    if (!document.getElementById('assistant-button')) {
        injectChatbotHTML();
    }

    // 2. Charger les connaissances en arrière-plan
    // On n'attend pas (await) pour ne pas bloquer l'affichage si le réseau est lent
    loadKnowledgeFromSupabase().catch(err => console.warn('Erreur chargement connaissances:', err));

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

        // Délai réaliste basé sur la longueur de la réponse
        const intent = detectIntent(query);
        const response = generateHumanResponse(intent);
        const responseLength = response.length;
        const baseDelay = 800;
        const delayPerChar = 15;
        const totalDelay = Math.min(baseDelay + (responseLength * delayPerChar), 3000);

        setTimeout(() => {
            hideTypingIndicator();
            addMessage('bot', response);
            isTyping = false;

            // Suggérer la FAQ après quelques messages
            if (messageCount === 3 && Math.random() > 0.6) {
                setTimeout(() => {
                    addMessage('bot', "💡 **Information** : Notre page FAQ est très complète et pourrait répondre à vos interrogations fréquentes. 📑");
                }, 2000);
            }
        }, totalDelay);
    });

    function updateWelcomeMessage() {
        if (!messagesContainer) return;

        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'flex justify-start welcome-message';
        welcomeDiv.innerHTML = `
            <div class="max-w-[85%] p-3 text-sm font-medium bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg">
                <p class="whitespace-pre-wrap">${getWelcomeMessage()}</p>
            </div>
        `;

        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(welcomeDiv);
    }

    function addMessage(role, text) {
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up mb-3`;

        const bubble = document.createElement('div');
        bubble.className = `max-w-[85%] p-3 text-sm font-medium rounded-lg ${role === 'user'
            ? 'bg-red-700 text-white'
            : 'bg-white text-gray-800 shadow-sm border border-gray-200'
            }`;

        const textEl = document.createElement('p');
        textEl.className = 'whitespace-pre-wrap leading-relaxed';

        // Support du markdown basique (gras)
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        textEl.innerHTML = formattedText;

        bubble.appendChild(textEl);
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
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
}

// Initialiser après chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotStandalone);
} else {
    setTimeout(initChatbotStandalone, 300);
}
