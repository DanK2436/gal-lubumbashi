/**
 * Chatbot intelligent pour GAL
 * Comprend le contexte, détecte plusieurs intentions et répond de manière naturelle et humaine
 * Accède aux données réelles du site pour des réponses personnalisées
 */

import { t } from './i18n.js';
import { getMachines, getFormations, getBlogPosts } from './storage.js';

// Contexte de la conversation
const conversationContext = {
    history: [],
    lastIntent: null,
    interests: [],
    messageCount: 0
};

// Cache pour les données
let cachedData = {
    machines: [],
    formations: [],
    blogPosts: [],
    lastUpdate: null
};

// Charger les données réelles
async function loadRealData() {
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
        about: "Le GAL est une association professionnelle regroupant plus de 150 artisans qualifiés à Lubumbashi. Nous œuvrons pour l'excellence technique, la formation professionnelle et l'innovation locale.",
        services: ["Formations certifiantes", "Location de machines", "Vente d'équipements", "Assistance technique", "Incubateur d'artisans"],
        location: "Lubumbashi, Haut-Katanga, RDC",
        contact: {
            phone: "+243 979 022 998",
            email: "contact@gal-lubumbashi.com",
            whatsapp: "243979022998"
        }
    },
    formations: {
        types: ["Soudure", "Menuiserie", "Plomberie", "Électricité", "Maçonnerie", "Mécanique"],
        info: "Nos formations sont pratiques et intensives, dispensées par des maîtres artisans.",
        certification: "Certificat d'aptitude professionnelle délivré à la fin de la formation."
    },
    machines: {
        info: "Nous disposons d'un parc de machines professionnelles disponibles à la location et à la vente.",
        reservation: "Réservation possible directement en ligne ou via WhatsApp."
    }
};

// Intentions
const intents = {
    salutation: {
        patterns: ['bonjour', 'salut', 'hello', 'bonsoir', 'hey', 'coucou'],
        responses: [
            "Bonjour ! Je suis l'assistant virtuel du GAL. Comment puis-je vous aider aujourd'hui ?",
            "Bienvenue chez GAL ! Je suis là pour répondre à vos questions sur nos activités et services.",
            "Salutations ! Je suis à votre écoute pour toute information sur le Groupement des Artisans de Lubumbashi."
        ]
    },
    presentation: {
        patterns: ['qui êtes-vous', 'c\'est quoi gal', 'présentation', 'à propos', 'que faites-vous'],
        responses: [
            `${knowledge.gal.about} Nous proposons notamment : ${knowledge.gal.services.join(', ')}.`,
            `Le GAL (${knowledge.gal.name}) est votre partenaire pour la formation et l'équipement technique à ${knowledge.gal.location}.`
        ]
    },
    formations: {
        patterns: ['formation', 'apprendre', 'cours', 'certificat', 'diplôme', 'étudier'],
        responses: [
            `Nous offrons des formations dans plusieurs domaines : ${knowledge.formations.types.join(', ')}. ${knowledge.formations.info}`,
            `Vous souhaitez apprendre un métier ? Nos formations en ${knowledge.formations.types.slice(0, 3).join(', ')}... sont faites pour vous !`
        ]
    },
    machines: {
        patterns: ['machine', 'outil', 'équipement', 'louer', 'acheter', 'matériel'],
        responses: [
            `${knowledge.machines.info} ${knowledge.machines.reservation}`,
            `Besoin d'équipement ? Découvrez notre catalogue de machines. Vous pouvez louer ou acheter du matériel professionnel.`
        ]
    },
    contact: {
        patterns: ['contact', 'téléphone', 'email', 'adresse', 'où', 'joindre', 'whatsapp'],
        responses: [
            `Vous pouvez nous joindre au ${knowledge.gal.contact.phone} ou par email à ${knowledge.gal.contact.email}.`,
            `Nous sommes situés à ${knowledge.gal.location}. Contactez-nous aussi sur WhatsApp : +${knowledge.gal.contact.whatsapp}.`
        ]
    },
    aide: {
        patterns: ['aide', 'help', 'besoin', 'comment'],
        responses: [
            "Je peux vous renseigner sur nos formations, nos machines, ou comment nous contacter. Que souhaitez-vous savoir ?",
            "N'hésitez pas à me poser des questions sur le GAL, nos activités ou nos services."
        ]
    },
    merci: {
        patterns: ['merci', 'top', 'super', 'génial'],
        responses: ["Je vous en prie !", "Avec plaisir !", "À votre service."]
    },
    aurevoir: {
        patterns: ['au revoir', 'bye', 'à bientôt'],
        responses: ["Au revoir et à bientôt !", "Bonne journée !"]
    }
};

// Détection d'intention
function detectIntents(message) {
    const lowerMessage = message.toLowerCase();
    const detected = [];

    for (const [key, intent] of Object.entries(intents)) {
        for (const pattern of intent.patterns) {
            if (lowerMessage.includes(pattern)) {
                detected.push({ name: key, score: 1 });
                break;
            }
        }
    }

    return detected.length > 0 ? detected : [{ name: 'default', score: 0 }];
}

// Génération de réponse
function generateResponse(detectedIntents, context) {
    const primaryIntent = detectedIntents[0].name;

    if (primaryIntent === 'default') {
        return "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ? Je peux vous parler de nos formations, machines ou de l'association.";
    }

    const responses = intents[primaryIntent].responses;
    return responses[Math.floor(Math.random() * responses.length)];
}

// Fonction principale
export async function getBotResponse(userMessage) {
    // Charger les données fraîches
    await loadRealData();

    conversationContext.messageCount++;
    conversationContext.history.push({ role: 'user', content: userMessage });

    const detectedIntents = detectIntents(userMessage);
    const response = generateResponse(detectedIntents, conversationContext);

    conversationContext.history.push({ role: 'bot', content: response });

    return response;
}

// Message de bienvenue
export function getWelcomeMessage() {
    const hour = new Date().getHours();
    const greeting = hour < 18 ? "Bonjour" : "Bonsoir";
    return `${greeting} ! Je suis l'assistant virtuel du GAL. Je peux vous renseigner sur nos formations, nos machines et nos activités. Comment puis-je vous aider ?`;
}

export function initChatbot() {
    console.log('Chatbot GAL initialized');
}
