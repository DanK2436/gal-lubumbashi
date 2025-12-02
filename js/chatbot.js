/**
 * Chatbot intelligent pour GAL
 * Comprend le contexte, détecte plusieurs intentions et répond de manière naturelle et humaine
 * Accède aux données réelles du site pour des réponses personnalisées
 */

import { t } from './i18n.js';
import {
    getMachines,
    getFormations,
    getBlogPosts,
    createChatbotConversation,
    addMessageToConversation,
    getChatbotKnowledge
} from './storage.js';

// Contexte de la conversation
const conversationContext = {
    history: [],
    lastIntent: null,
    interests: [],
    messageCount: 0,
    conversationId: null
};

// Cache pour les données dynamiques du site
let cachedData = {
    machines: [],
    formations: [],
    blogPosts: [],
    lastUpdate: null
};

// Base de connaissances (chargée depuis Supabase)
let intents = [];
let knowledgeLoaded = false;

// Charger les données réelles du site (Machines, Formations...)
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
        console.warn('Chatbot: Erreur lors du chargement des données site', error);
    }

    return cachedData;
}

// Charger la base de connaissances du chatbot depuis Supabase
async function loadKnowledgeBase() {
    if (knowledgeLoaded && intents.length > 0) return;

    try {
        const data = await getChatbotKnowledge();
        if (data && data.length > 0) {
            intents = data;
            knowledgeLoaded = true;
            console.log('Chatbot: Base de connaissances chargée', intents.length, 'entrées');
        }
    } catch (error) {
        console.error('Chatbot: Erreur chargement base de connaissances', error);
        // Fallback si erreur (on pourrait garder une version minimale ici si voulu)
    }
}

// Détection d'intention
function detectIntents(message) {
    const lowerMessage = message.toLowerCase();
    const detected = [];

    for (const intent of intents) {
        // Vérifier si patterns existe et est un tableau
        if (!intent.patterns || !Array.isArray(intent.patterns)) continue;

        for (const pattern of intent.patterns) {
            // Nettoyage simple des patterns pour la comparaison (retrait des **)
            const cleanPattern = pattern.replace(/\*\*/g, '').toLowerCase();
            if (lowerMessage.includes(cleanPattern)) {
                detected.push({ name: intent.tag, score: 1 });
                break;
            }
        }
    }

    return detected.length > 0 ? detected : [{ name: 'default', score: 0 }];
}

// Génération de réponse
function generateResponse(detectedIntents, context) {
    const primaryIntentTag = detectedIntents[0].name;

    if (primaryIntentTag === 'default') {
        return "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ? Je peux vous parler de nos machines, formations, conditions d'adhésion ou de nos services.";
    }

    const intent = intents.find(i => i.tag === primaryIntentTag);
    if (intent && intent.responses && Array.isArray(intent.responses)) {
        return intent.responses[Math.floor(Math.random() * intent.responses.length)];
    }

    return "Désolé, je n'ai pas trouvé de réponse appropriée.";
}

// Fonction principale
export async function getBotResponse(userMessage) {
    // Charger les données fraîches et la base de connaissances
    await Promise.all([loadRealData(), loadKnowledgeBase()]);

    // Initialiser la conversation Supabase si nécessaire
    if (!conversationContext.conversationId) {
        try {
            const conversation = await createChatbotConversation({
                messages: []
            });
            conversationContext.conversationId = conversation.id;
            // Sauvegarder aussi l'ID dans sessionStorage pour persister au refresh si voulu
            sessionStorage.setItem('gal_current_conversation_id', conversation.id);
        } catch (error) {
            console.error('Erreur création conversation chatbot:', error);
        }
    }

    conversationContext.messageCount++;

    // Sauvegarder message utilisateur
    const userMsgObj = { role: 'user', content: userMessage };
    conversationContext.history.push(userMsgObj);

    if (conversationContext.conversationId) {
        addMessageToConversation(conversationContext.conversationId, userMsgObj).catch(console.error);
    }

    const detectedIntents = detectIntents(userMessage);
    const response = generateResponse(detectedIntents, conversationContext);

    // Sauvegarder réponse bot
    const botMsgObj = { role: 'assistant', content: response };
    conversationContext.history.push(botMsgObj);

    if (conversationContext.conversationId) {
        addMessageToConversation(conversationContext.conversationId, botMsgObj).catch(console.error);
    }

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

    // Précharger la base de connaissances
    loadKnowledgeBase();

    // Récupérer conversation existante si possible (optionnel)
    const savedId = sessionStorage.getItem('gal_current_conversation_id');
    if (savedId) {
        conversationContext.conversationId = savedId;
    }
}
