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
    addMessageToConversation
} from './storage.js';

// Contexte de la conversation
const conversationContext = {
    history: [],
    lastIntent: null,
    interests: [],
    messageCount: 0,
    conversationId: null
};

// ... (reste du code inchangé jusqu'à getBotResponse)

// Fonction principale
export async function getBotResponse(userMessage) {
    // Charger les données fraîches
    await loadRealData();

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
    // Récupérer conversation existante si possible (optionnel)
    const savedId = sessionStorage.getItem('gal_current_conversation_id');
    if (savedId) {
        conversationContext.conversationId = savedId;
    }
}
