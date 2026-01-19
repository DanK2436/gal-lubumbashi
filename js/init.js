/**
 * Point d'entrée principal - Initialise tous les composants
 */

import { initAssistant } from './assistant.js';
import { initChatbot } from './chatbot.js';

// Initialiser le chatbot et l'assistant
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation GAL Web...');

    // Initialiser le chatbot
    initChatbot();

    // Initialiser l'interface de l'assistant
    initAssistant();

    console.log('✅ GAL Web initialisé avec succès !');
});
