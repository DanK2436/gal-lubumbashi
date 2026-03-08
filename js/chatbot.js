/**
 * Chatbot intelligent pour GAL - Version 2.0 avec Google Gemini AI
 * Comprend le contexte, maintient l'historique et répond avec précision grâce à l'IA
 */

import { askGemini, getWelcomeMessage as geminiWelcome, resetConversation } from './gemini-ai.js';
import {
    getMachines,
    getFormations,
    getBlogPosts,
    getProjects
} from './storage.js';

// Cache pour les données dynamiques du site
let cachedData = {
    machines: [],
    formations: [],
    blogPosts: [],
    projects: [],
    lastUpdate: null
};

// Charger les données réelles du site pour enrichir le contexte IA
async function loadRealData() {
    const now = Date.now();
    // Rafraîchir toutes les 5 minutes
    if (cachedData.lastUpdate && (now - cachedData.lastUpdate) < 300000) {
        return cachedData;
    }

    try {
        const [machines, formations, blogPosts, projects] = await Promise.all([
            getMachines().catch(() => []),
            getFormations().catch(() => []),
            getBlogPosts().catch(() => []),
            getProjects().catch(() => [])
        ]);

        cachedData.machines = machines || [];
        cachedData.formations = formations || [];
        cachedData.blogPosts = blogPosts || [];
        cachedData.projects = projects || [];
        cachedData.lastUpdate = now;

        console.log(`✅ Données chatbot IA chargées: ${cachedData.machines.length} machines, ${cachedData.formations.length} formations`);
    } catch (error) {
        console.warn('⚠️ Erreur chargement données chatbot:', error);
    }

    return cachedData;
}

/**
 * Fonction principale - Obtenir la réponse du bot via Gemini AI
 * @param {string} userMessage - Message de l'utilisateur
 * @returns {Promise<string>} Réponse de l'IA
 */
export async function getBotResponse(userMessage) {
    // Charger les données fraîches du site
    const siteData = await loadRealData();

    // Envoyer à Gemini AI avec le contexte du site
    const response = await askGemini(userMessage, siteData);

    return response;
}

/**
 * Message de bienvenue enrichi par l'IA
 */
export function getWelcomeMessage() {
    return geminiWelcome();
}

/**
 * Initialiser le chatbot IA
 */
export function initChatbot() {
    console.log('🤖 Chatbot GAL v2.0 initialisé avec Google Gemini AI');
    // Précharger les données
    loadRealData();
}

/**
 * Réinitialiser la conversation
 */
export function resetChat() {
    resetConversation();
    console.log('🔄 Conversation réinitialisée');
}
