/**
 * Chatbot intelligent pour GAL
 * Comprend le contexte et répond de manière naturelle
 */

import { t } from './i18n.js';

// Base de connaissances du chatbot
const knowledge = {
    gal: {
        name: "Groupement des Artisans de Lubumbashi",
        about: "Nous sommes une association professionnelle qui regroupe plus de 150 artisans qualifiés à Lubumbashi. Depuis plus de 10 ans, nous accompagnons nos membres dans leur développement professionnel.",
        services: ["Formations certifiantes", "Location de machines", "Vente d'équipements", "Assistance technique", "Mise en réseau"],
        location: "Lubumbashi, République Démocratique du Congo",
        contact: {
            phone: "+243 979 022 998",
            email: "contact@gal-lubumbashi.com",
            whatsapp: "243979022998"
        }
    },
    formations: {
        available: true,
        types: ["Soudure", "Menuiserie", "Plomberie", "Électricité", "Maçonnerie"],
        certification: "Oui, toutes nos formations sont certifiantes",
        duration: "Variable selon la formation (de 2 semaines à 3 mois)",
        info: "Nous proposons des formations pratiques et théoriques dispensées par des artisans expérimentés."
    },
    machines: {
        available: true,
        services: ["Location", "Vente", "Maintenance"],
        types: ["Équipement de soudure", "Outils de menuiserie", "Machines de construction"],
        info: "Nous mettons à disposition des machines professionnelles de haute qualité."
    },
    adhesion: {
        process: "Pour devenir membre, vous devez remplir le formulaire d'adhésion et fournir les documents requis.",
        benefits: ["Accès aux formations", "Location d'équipements", "Réseau professionnel", "Assistance technique"],
        cost: "Les frais d'adhésion sont accessibles. Contactez-nous pour plus d'informations."
    }
};

// Intentions et patterns
const intents = {
    salutation: {
        patterns: ['bonjour', 'bonsoir', 'salut', 'hello', 'hi', 'coucou'],
        responses: [
            "Bonjour ! Je suis ravi de vous accueillir chez GAL. Comment puis-je vous aider aujourd'hui ?",
            "Bonjour ! Bienvenue au Groupement des Artisans de Lubumbashi. Que puis-je faire pour vous ?",
            "Salut ! Je suis là pour répondre à toutes vos questions sur GAL. N'hésitez pas !"
        ]
    },
    presentation: {
        patterns: ['qui êtes-vous', 'c\'est quoi gal', 'présentation', 'à propos', 'gal ?', 'qu\'est-ce que'],
        responses: [
            `${knowledge.gal.about} Nous offrons des formations, des équipements et un réseau professionnel solide.`,
            `GAL, c'est ${knowledge.gal.name}. ${knowledge.gal.about}`,
            `Nous sommes le principal regroupement d'artisans à ${knowledge.gal.location}. Notre mission est d'accompagner nos membres vers l'excellence professionnelle.`
        ]
    },
    formations: {
        patterns: ['formation', 'apprendre', 'cours', 'étudier', 'certif'],
        responses: [
            `Nous proposons des formations dans plusieurs domaines : ${knowledge.formations.types.join(', ')}. ${knowledge.formations.info} Voulez-vous en savoir plus sur une formation en particulier ?`,
            `Nos formations sont certifiantes et couvrent ${knowledge.formations.types.length} métiers principaux. Elles durent ${knowledge.formations.duration}. Quelle formation vous intéresse ?`,
            `Excellente question ! Nous formons des artisans dans ${knowledge.formations.types.join(', ')}. Toutes nos formations délivrent un certificat reconnu.`
        ]
    },
    machines: {
        patterns: ['machine', 'équipement', 'outil', 'matériel', 'location', 'acheter'],
        responses: [
            `Nous proposons la ${knowledge.machines.services.join(', ')} de machines professionnelles. Nous avons ${knowledge.machines.types.join(', ')}. Quel type d'équipement recherchez-vous ?`,
            `Notre parc d'équipements comprend ${knowledge.machines.types.join(', ')}. Vous pouvez louer ou acheter selon vos besoins.`,
            `Oui, nous avons un service complet d'équipements ! ${knowledge.machines.info} Puis-je vous orienter vers un type de machine en particulier ?`
        ]
    },
    adhesion: {
        patterns: ['adhérer', 'membre', 'inscription', 'rejoindre', 'devenir membre', 'adhésion'],
        responses: [
            `Super ! Pour devenir membre de GAL, ${knowledge.adhesion.process} Vous bénéficierez de : ${knowledge.adhesion.benefits.join(', ')}. Voulez-vous que je vous redirige vers le formulaire ?`,
            `Bienvenue dans la famille ! ${knowledge.adhesion.process} Les avantages incluent ${knowledge.adhesion.benefits.join(', ')}.`,
            `Excellent choix ! L'adhésion vous donne accès à ${knowledge.adhesion.benefits.join(', ')}. ${knowledge.adhesion.process}`
        ]
    },
    contact: {
        patterns: ['contact', 'téléphone', 'email', 'joindre', 'appeler', 'écrire', 'whatsapp'],
        responses: [
            `Voici nos coordonnées :\n📞 ${knowledge.gal.contact.phone}\n📧 ${knowledge.gal.contact.email}\n💬 WhatsApp: +${knowledge.gal.contact.whatsapp}\n\nVous pouvez aussi remplir notre formulaire de contact en ligne !`,
            `Vous pouvez nous contacter par téléphone au ${knowledge.gal.contact.phone}, par email à ${knowledge.gal.contact.email}, ou via WhatsApp. Quel moyen préférez-vous ?`,
            `Je suis là pour vous aider, mais pour une assistance personnalisée, contactez-nous :\n☎️ ${knowledge.gal.contact.phone}\n✉️ ${knowledge.gal.contact.email}`
        ]
    },
    prix: {
        patterns: ['prix', 'coût', 'tarif', 'combien', 'montant', 'frais'],
        responses: [
            `Les tarifs varient selon le service (formation, location, adhésion). Pour obtenir un devis précis adapté à vos besoins, je vous invite à nous contacter au ${knowledge.gal.contact.phone} ou via WhatsApp.`,
            `Chaque service a son tarif propre. Le mieux est de nous appeler pour discuter de votre projet et obtenir un devis personnalisé. Préférez-vous qu'on vous contacte par téléphone ou WhatsApp ?`,
            `Pour une information tarifaire précise, je vous recommande de parler directement avec notre équipe. Ils pourront vous faire un devis sur mesure. ${knowledge.gal.contact.phone}`
        ]
    },
    merci: {
        patterns: ['merci', 'thank', 'thanks', 'super', 'cool', 'parfait', 'ok'],
        responses: [
            "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Bonne journée !",
            "Avec plaisir ! C'est un plaisir de vous aider. À bientôt !",
            "Content d'avoir pu vous aider ! L'équipe GAL reste à votre disposition. 😊"
        ]
    },
    aurevoir: {
        patterns: ['au revoir', 'bye', 'ciao', 'à bientôt', 'salut', 'adieu'],
        responses: [
            "Au revoir ! À très bientôt chez GAL. 👋",
            "À bientôt ! N'hésitez pas à revenir si vous avez des questions. Bonne journée !",
            "Merci de votre visite ! Au plaisir de vous revoir. 😊"
        ]
    },
    default: {
        patterns: [],
        responses: [
            "C'est une excellente question ! Pour vous donner une réponse précise, je vous invite à contacter directement notre équipe au ${knowledge.gal.contact.phone}. Ils seront ravis de vous aider !",
            "Je ne suis pas sûr d'avoir bien compris. Pourriez-vous reformuler ? Sinon, notre équipe est disponible au ${knowledge.gal.contact.phone} pour toute question spécifique.",
            "Hmm, je n'ai pas d'information précise sur ce point. Le mieux serait de contacter notre équipe qui pourra vous renseigner : ${knowledge.gal.contact.phone} ou ${knowledge.gal.contact.email}."
        ]
    }
};

// Détection d'intention
function detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim();

    for (const [intentName, intent] of Object.entries(intents)) {
        for (const pattern of intent.patterns) {
            if (lowerMessage.includes(pattern)) {
                return intentName;
            }
        }
    }

    return 'default';
}

// Génération de réponse
function generateResponse(intent) {
    const intentData = intents[intent];
    const responses = intentData.responses;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex].replace(/\$\{knowledge\.gal\.contact\.(phone|email|whatsapp)\}/g, (match, key) => {
        return knowledge.gal.contact[key];
    });
}

// Contexte de conversation
let conversationContext = {
    lastIntent: null,
    messageCount: 0,
    userName: null
};

// Fonction principale
export function getBotResponse(userMessage) {
    conversationContext.messageCount++;

    // Détecter l'intention
    const intent = detectIntent(userMessage);
    conversationContext.lastIntent = intent;

    // Générer et retourner la réponse
    const response = generateResponse(intent);

    return response;
}

// Initialisation
export function initChatbot() {
    console.log('🤖 Chatbot GAL initialisé');
}

// Message de bienvenue personnalisé
export function getWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting = "Bonjour";

    if (hour < 12) {
        greeting = "Bonjour";
    } else if (hour < 18) {
        greeting = "Bon après-midi";
    } else {
        greeting = "Bonsoir";
    }

    return `${greeting} ! 👋 Je suis l'assistant virtuel de GAL. Je suis là pour répondre à vos questions sur nos formations, nos équipements et nos services. Comment puis-je vous aider ?`;
}
