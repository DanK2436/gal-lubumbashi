/**
 * Chatbot intelligent pour GAL
 * Comprend le contexte, détecte plusieurs intentions et répond de manière naturelle et humaine
 * Accède aux données réelles du site pour des réponses personnalisées
 */

import { t } from './i18n.js';
import { getMachines, getFormations, getBlogPosts } from './storage.js';

// Cache pour les données
let cachedData = {
    machines: [],
    formations: [],
    blogPosts: [],
    lastUpdate: null
};

// Charger les données réelles
async function loadRealData() {
    // Recharger uniquement si les données sont anciennes (>5 min)
    const now = Date.now();
    if (cachedData.lastUpdate && (now - cachedData.lastUpdate) < 300000) {
        return cachedData;
    }

    try {
        cachedData.machines = await getMachines();
        cachedData.formations = await getFormations();
        cachedData.blogPosts = await getBlogPosts();
        cachedData.lastUpdate = now;
    } catch (error) {
        console.warn('Chatbot: Erreur lors du chargement des données', error);
    }

    return cachedData;
}

// Base de connaissances enrichie
const knowledge = {
    gal: {
        name: "Groupement des Artisans de Lubumbashi",
        about: "Nous sommes une association professionnelle qui regroupe plus de 150 artisans qualifiés à Lubumbashi. Depuis plus de 10 ans, nous accompagnons nos membres dans leur développement professionnel à travers des formations de qualité, la mise à disposition d'équipements professionnels et un réseau solidaire.",
        services: ["Formations certifiantes", "Location de machines", "Vente d'équipements", "Assistance technique", "Mise en réseau professionnel"],
        location: "Lubumbashi, République Démocratique du Congo",
        contact: {
            phone: "+243 979 022 998",
            email: "contact@gal-lubumbashi.com",
            whatsapp: "243979022998"
        }
    },
    formations: {
        available: true,
        types: ["Soudure", "Menuiserie", "Plomberie", "Électricité", "Maçonnerie", "Mécanique"],
        certification: "Oui, toutes nos formations délivrent un certificat reconnu",
        duration: "Variable selon la formation (de 2 semaines à 3 mois)",
        info: "Nos formations combinent théorie et pratique intensive. Vous apprenez directement avec des artisans expérimentés sur de vrais projets.",
        advantages: ["Formateurs professionnels actifs", "Matériel de qualité", "Certification reconnue", "Suivi post-formation", "Insertion professionnelle"]
    },
    machines: {
        available: true,
        services: ["Location courte durée", "Location longue durée", "Vente", "Maintenance", "Réparation"],
        types: ["Équipement de soudure", "Outils de menuiserie", "Machines agroalimentaires", "Machines de construction"],
        info: "Notre parc de machines est régulièrement entretenu et renouvelé. Nous proposons uniquement du matériel professionnel de haute qualité.",
        reservation: "Vous pouvez réserver une machine directement sur notre site dans la section Machines."
    },
    adhesion: {
        process: "Pour devenir membre, remplissez le formulaire en ligne ou passez à nos bureaux avec une copie de votre carte d'identité et une photo.",
        benefits: [
            "Tarifs préférentiels sur les formations (-30%)",
            "Accès prioritaire aux équipements",
            "Réseau professionnel actif",
            "Assistance technique gratuite",
            "Opportunités de collaboration",
            "Veille technologique"
        ],
        cost: "Les frais d'adhésion sont de 50 USD par an. Contactez-nous pour plus de détails."
    }
};

// Intentions avec patterns enrichis et synonymes
const intents = {
    salutation: {
        patterns: [
            'bonjour', 'bonsoir', 'salut', 'hello', 'hi', 'coucou', 'bjr', 'bsr',
            'hey', 'yo', 'cc', 'slt', 'good morning', 'good evening'
        ],
        responses: [
            "Bonjour ! 👋 Je suis ravi de vous accueillir chez GAL. Je m'appelle Lumu, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
            "Salut ! Bienvenue au Groupement des Artisans de Lubumbashi. Je suis Lumu, et je suis là pour répondre à toutes vos questions. Que souhaitez-vous savoir ?",
            "Bonjour et bienvenue ! Je suis Lumu, l'assistant GAL. N'hésitez pas à me poser vos questions sur nos formations, nos machines ou notre association !"
        ]
    },
    presentation: {
        patterns: [
            'qui êtes-vous', 'c\'est quoi gal', 'présentation', 'à propos', 'gal ?',
            'qu\'est-ce que', 'connaitre gal', 'c\'est qui', 'qui est gal',
            'parlez-moi de gal', 'dites-moi', 'informations sur gal'
        ],
        responses: [
            `${knowledge.gal.about}\n\nNous offrons notamment : ${knowledge.gal.services.join(', ')}.\n\nQue souhaitez-vous savoir de plus ?`,
            `GAL, c'est ${knowledge.gal.name}, votre partenaire de confiance depuis plus de 10 ans ! 💪\n\n${knowledge.gal.about}\n\nJe peux vous en dire plus sur nos formations, nos machines ou l'adhésion si vous voulez !`,
            `Laissez-moi vous présenter GAL ! Nous sommes le principal regroupement d'artisans professionnels à ${knowledge.gal.location}.\n\n${knowledge.gal.about}\n\nVous avez une question spécifique ?`
        ]
    },
    formations: {
        patterns: [
            'formation', 'apprendre', 'cours', 'étudier', 'certif', 'école',
            'enseigner', 'former', 'apprentissage', 'diplôme', 'stage',
            'programme', 'curriculum', 'compétence', 'métier'
        ],
        responses: [
            `📚 Excellente question ! Nous proposons des formations professionnelles dans **${knowledge.formations.types.length} domaines** :\n\n${knowledge.formations.types.map(t => `• ${t}`).join('\n')}\n\n${knowledge.formations.info}\n\nToutes nos formations sont **certifiantes** et durent ${knowledge.formations.duration}.\n\n💡 Une formation vous intéresse en particulier ?`,
            `Nos formations sont notre fierté ! 🎓\n\nVoici ce qu'on propose :\n${knowledge.formations.types.map(t => `✓ ${t}`).join('\n')}\n\nLes + de nos formations :\n${knowledge.formations.advantages.slice(0, 3).map(a => `• ${a}`).join('\n')}\n\nVoulez-vous connaître les dates de la prochaine session ?`,
            `Super choix de vous former avec nous ! 💪\n\nOn forme des artisans dans ${knowledge.formations.types.join(', ')}. ${knowledge.formations.info}\n\n${knowledge.formations.certification} et la durée est ${knowledge.formations.duration}.\n\nQuel domaine vous intéresse le plus ?`
        ]
    },
    machines: {
        patterns: [
            'machine', 'équipement', 'outil', 'matériel', 'location', 'acheter',
            'louer', 'réserver', 'vente', 'disponible', 'prix machine',
            'catalogue', 'réservation'
        ],
        responses: [
            `🛠️ Super ! Nous avons un parc complet de machines professionnelles.\n\n**Services disponibles** :\n${knowledge.machines.services.map(s => `• ${s}`).join('\n')}\n\n**Types d'équipements** :\n${knowledge.machines.types.map(t => `• ${t}`).join('\n')}\n\n${knowledge.machines.info}\n\n💡 ${knowledge.machines.reservation}\n\nQuel type de machine recherchez-vous ?`,
            `Nos machines, c'est du sérieux ! 💪\n\nOn propose ${knowledge.machines.services.join(', ')}. Notre catalogue comprend : ${knowledge.machines.types.join(', ')}.\n\n**Bon à savoir** : ${knowledge.machines.reservation}\n\nBesoin d'une machine spécifique ?`,
            `Oui, nous avons un service complet d'équipements ! ${knowledge.machines.info}\n\nVous pouvez **réserver** directement en ligne ou nous appeler.\n\nPuis-je vous orienter vers un type de machine en particulier ?`
        ]
    },
    adhesion: {
        patterns: [
            'adhérer', 'membre', 'inscription', 'rejoindre', 'devenir membre',
            'adhésion', 's\'inscrire', 'comment devenir', 'participer',
            'intégrer', 'faire partie'
        ],
        responses: [
            `🎉 Bienvenue dans la famille GAL !\n\n**Pour adhérer ** :\n${knowledge.adhesion.process}\n\n**Vos avantages membre** :\n${knowledge.adhesion.benefits.slice(0, 4).map(b => `✓ ${b}`).join('\n')}\n\n**Coût** : ${knowledge.adhesion.cost}\n\nJe vous redirige vers le formulaire d'inscription ?`,
            `Excellent choix ! 👏\n\nL'adhésion vous donne accès à :\n${knowledge.adhesion.benefits.map(b => `• ${b}`).join('\n')}\n\n**Comment faire ?** ${knowledge.adhesion.process}\n\nUne fois membre, vous bénéficiez immédiatement de tous les avantages !`,
            `Super ! Rejoignez nos ${knowledge.gal.about.match(/\d+/)?.[0]} artisans ! 💪\n\n${knowledge.adhesion.process}\n\nLes avantages incluent ${knowledge.adhesion.benefits.slice(0, 3).join(', ')} et bien plus !\n\nVoulez-vous que je vous aide avec l'inscription ?`
        ]
    },
    contact: {
        patterns: [
            'contact', 'téléphone', 'email', 'joindre', 'appeler', 'écrire',
            'whatsapp', 'numéro', 'coordonnées', 'où', 'adresse', 'localiser',
            'trouver', 'situé'
        ],
        responses: [
            `📞 Vous pouvez nous contacter facilement :\n\n**Téléphone** : ${knowledge.gal.contact.phone}\n**Email** : ${knowledge.gal.contact.email}\n**WhatsApp** : +${knowledge.gal.contact.whatsapp}\n**Localisation** : ${knowledge.gal.location}\n\nVous pouvez aussi remplir notre formulaire de contact en ligne pour une réponse rapide !\n\nPréférez-vous un moyen en particulier ?`,
            `Nos coordonnées sont à votre disposition ! 📧\n\n☎️ ${knowledge.gal.contact.phone}\n✉️ ${knowledge.gal.contact.email}\n💬 WhatsApp : +${knowledge.gal.contact.whatsapp}\n📍 ${knowledge.gal.location}\n\nNotre équipe est généralement disponible du lundi au vendredi, de 8h à 17h. On répond très vite !`,
            `Pour nous joindre, plusieurs options :\n\n1️⃣ **Téléphone** : ${knowledge.gal.contact.phone} (appels et SMS)\n2️⃣ **WhatsApp** : +${knowledge.gal.contact.whatsapp} (réponse rapide !)\n3️⃣ **Email** : ${knowledge.gal.contact.email}\n4️⃣ **En personne** : ${knowledge.gal.location}\n\nComment souhaitez-vous nous contacter ?`
        ]
    },
    prix: {
        patterns: [
            'prix', 'coût', 'tarif', 'combien', 'montant', 'frais', 'payer',
            'payement', 'cher', 'budget', 'coûte', 'facture'
        ],
        responses: [
            `💰 Question importante ! Les tarifs varient selon le service :\n\n• **Formations** : Dépend du programme (tarif membre : -30%)\n• **Location machines** : Selon durée et type\n• **Adhésion** : ${knowledge.adhesion.cost}\n\nPour un **devis personnalisé** adapté à vos besoins, je vous recommande de contacter notre équipe au ${knowledge.gal.contact.phone} ou via WhatsApp.\n\nIls vous feront un prix sur mesure ! Quel service vous intéresse ?`,
            `Les prix dépendent de ce que vous cherchez ! 💵\n\nLe mieux est de parler directement avec notre équipe pour obtenir un **devis précis**. Préférez-vous qu'on vous contacte par téléphone ou WhatsApp ?\n\n📞 ${knowledge.gal.contact.phone}\n💬 WhatsApp: +${knowledge.gal.contact.whatsapp}\n\nIls sont sympas et vous feront le meilleur prix !`,
            `😊 Pour une information tarifaire précise, notre équipe commerciale est la mieux placée.\n\nContactez-les :\n• Par téléphone : ${knowledge.gal.contact.phone}\n• Sur WhatsApp : +${knowledge.gal.contact.whatsapp}\n\nIls vous prépareront un devis détaillé gratuitement !`
        ]
    },
    merci: {
        patterns: [
            'merci', 'thank', 'thanks', 'super', 'cool', 'parfait', 'ok',
            'génial', 'top', 'excellent', 'bien', 'formidable', 'bien reçu'
        ],
        responses: [
            "Avec grand plaisir ! 😊 N'hésitez surtout pas si vous avez d'autres questions. Je suis là pour ça ! Bonne journée ! ✨",
            "Content d'avoir pu vous aider ! 👍 L'équipe GAL et moi restons à votre disposition. À très bientôt !",
            "Je vous en prie ! C'est toujours un plaisir d'accompagner nos futurs membres et partenaires. Bonne continuation ! 🎯"
        ]
    },
    aurevoir: {
        patterns: [
            'au revoir', 'bye', 'ciao', 'à bientôt', 'salut', 'adieu',
            'à plus', 'à+', 'see you', 'good bye', 'tchao'
        ],
        responses: [
            "Au revoir et à très bientôt chez GAL ! 👋 N'hésitez pas à revenir quand vous voulez !",
            "À bientôt ! 😊 Si vous avez d'autres questions, je seraitoujours là. Bonne journée !",
            "Merci de votre visite ! Au plaisir de vous revoir. Prenez soin de vous ! ✨"
        ]
    },
    aide: {
        patterns: [
            'aide', 'help', 'comment', 'comment faire', 'besoin', 'question',
            'que peux-tu', 'que puis-je', 'peux-tu m\'aider', 'assister'
        ],
        responses: [
            `Je peux vous aider sur plein de sujets ! 🎯\n\n**Mes domaines d'expertise** :\n• Informations sur GAL et nos services\n• Détails sur nos formations\n• Catalogue et réservation de machines\n• Processus d'adhésion\n• Coordonnées et contact\n\nPosez-moi n'importe quelle question, je ferai de mon mieux pour vous répondre de manière claire et utile !`,
            `Avec plaisir ! Je suis là pour ça ! 💪\n\nJe peux vous renseigner sur :\n✓ Nos formations professionnelles\n✓ La location/vente de machines\n✓ Comment devenir membre\n✓ Nos coordonnées\n✓ Tout ce qui concerne GAL !\n\nQu'est-ce qui vous intéresse ?`,
            `Bien sûr ! Je suis Lumu, votre guide GAL ! 🤝\n\nPosez-moi vos questions sur :\n• Les formations (types, durée, certification)\n• Les machines (location, achat, réservation)\n• L'adhésion (avantages, processus)\n• Comment nous contacter\n\nJe vous écoute !`
        ]
    },
    default: {
        patterns: [],
        responses: [
            `Hmm, je ne suis pas sûr d'avoir bien compris votre question. 🤔\n\nPourriez-vous reformuler ? Ou peut-être que notre équipe pourrait mieux vous aider directement :\n📞 ${knowledge.gal.contact.phone}\n💬 WhatsApp : +${knowledge.gal.contact.whatsapp}`,
            `Excellente question ! Mais je préfère vous mettre en contact avec notre équipe pour une réponse plus précise.\n\nContactez-nous :\n• Téléphone : ${knowledge.gal.contact.phone}\n• Email : ${knowledge.gal.contact.email}\n\nIls seront ravis de vous aider !`,
            `Je n'ai pas d'information précise sur ce point spécifique. 😅\n\nMais pas de souci ! Notre équipe experte peut certainement vous renseigner :\n☎️ ${knowledge.gal.contact.phone}\n✉️ ${knowledge.gal.contact.email}\n\nVoulez-vous que je vous donne plus d'infos sur nos formations ou nos machines ?`
        ]
    }
};

// Détection d'intention avec score et multi-intent
function detectIntents(message) {
    const lowerMessage = message.toLowerCase().trim();
    const detectedIntents = [];

    for (const [intentName, intent] of Object.entries(intents)) {
        let score = 0;
        const matchedPatterns = [];

        for (const pattern of intent.patterns) {
            if (lowerMessage.includes(pattern)) {
                score += 1;
                matchedPatterns.push(pattern);
            }
        }

        if (score > 0) {
            detectedIntents.push({ name: intentName, score, patterns: matchedPatterns });
        }
    }

    // Trier par score décroissant
    conversationHistory: []
};

// Fonction principale améliorée
export function getBotResponse(userMessage) {
    conversationContext.messageCount++;
    conversationContext.conversationHistory.push({ role: 'user', message: userMessage });

    // Détecter les intentions
    const detectedIntents = detectIntents(userMessage);
    const primaryIntent = detectedIntents[0].name;

    // Mettre à jour le contexte
    conversationContext.lastIntent = primaryIntent;
    if (primaryIntent !== 'default' && !conversationContext.interests.includes(primaryIntent)) {
        conversationContext.interests.push(primaryIntent);
    }

    // Générer et retourner la réponse
    const response = generateResponse(detectedIntents, conversationContext);
    conversationContext.conversationHistory.push({ role: 'bot', message: response });

    return response;
}

// Initialisation
export function initChatbot() {
    console.log('🤖 Chatbot GAL (Lumu) initialisé - Version intelligente');
}

// Message de bienvenue personnalisé et dynamique
export function getWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting = "Bonjour";
    let emoji = "☀️";

    if (hour < 12) {
        greeting = "Bonjour";
        emoji = "🌅";
    } else if (hour < 18) {
        greeting = "Bon après-midi";
        emoji = "☀️";
    } else {
        greeting = "Bonsoir";
        emoji = "🌙";
    }

    const welcomeMessages = [
        `${greeting} ${emoji} ! Je suis **Lumu**, votre assistant virtuel GAL.\n\nJe connais tout sur nos formations, nos machines et notre association. Comment puis-je vous aider aujourd'hui ?`,
        `${greeting} et bienvenue chez GAL ! Je m'appelle **Lumu** 🤖\n\nJe suis là pour répondre à toutes vos questions sur nos formations professionnelles, nos équipements et l'adhésion. N'hésitez pas !`,
        `${greeting} ! 👋 **Lumu** à votre service !\n\nFormations, machines, adhésion... Je peux vous renseigner sur tout ce qui concerne GAL. Que souhaitez-vous savoir ?`
    ];

    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}
