<<<<<<< HEAD
/**
 * Assistant UI - Interface utilisateur pour le chatbot
 */

import { getBotResponse, getWelcomeMessage } from './chatbot.js';
import { showToast } from './ui.js';

let isTyping = false;
const messages = [];

// Initialiser l'assistant
export function initAssistant() {
    console.log('🎯 Initialisation de l\'assistant...');

    // Boutons de toggle
    const assistantButton = document.getElementById('assistant-button');
    const closeAssistant = document.getElementById('close-assistant');
    const chatForm = document.getElementById('chat-form');

    if (!assistantButton || !closeAssistant || !chatForm) {
        console.warn('⚠️ Éléments de l\'assistant non trouvés');
        return;
    }

    // Ouvrir le chat
    assistantButton.addEventListener('click', openChat);

    // Fermer le chat
    closeAssistant.addEventListener('click', closeChat);

    // Gérer l'envoi de messages
    chatForm.addEventListener('submit', handleSubmit);

    // Message de bienvenue personnalisé
    updateWelcomeMessage();
}

// Ouvrir le chat
function openChat() {
    const assistantButton = document.getElementById('assistant-button');
    const assistantChat = document.getElementById('assistant-chat');

    assistantButton.classList.add('hidden');
    assistantChat.classList.remove('hidden');

    // Focus sur l'input
    setTimeout(() => {
        document.getElementById('chat-input')?.focus();
    }, 300);
}

// Fermer le chat
function closeChat() {
    const assistantButton = document.getElementById('assistant-button');
    const assistantChat = document.getElementById('assistant-chat');

    assistantChat.classList.add('hidden');
    assistantButton.classList.remove('hidden');
}

// Mettre à jour le message de bienvenue
function updateWelcomeMessage() {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    // Supprimer l'ancien message de bienvenue
    const existingWelcome = messagesContainer.querySelector('.welcome-message');
    if (existingWelcome) {
        existingWelcome.remove();
    }

    // Ajouter le nouveau message de bienvenue
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'flex justify-start welcome-message';

    welcomeDiv.innerHTML = `
        <div class="max-w-[85%] p-3 text-sm font-medium bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg">
            <p class="whitespace-pre-wrap">${getWelcomeMessage()}</p>
        </div>
    `;

    messagesContainer.insertBefore(welcomeDiv, messagesContainer.firstChild);
}

// Gérer la soumission du formulaire
async function handleSubmit(e) {
    e.preventDefault();

    const input = document.getElementById('chat-input');
    const query = input.value.trim();

    if (!query || isTyping) return;

    // Ajouter le message utilisateur
    addMessage('user', query);
    input.value = '';

    // Afficher l'indicateur de frappe
    isTyping = true;
    showTypingIndicator();

    // Simuler un délai de réponse naturel (500-1500ms)
    const delay = 500 + Math.random() * 1000;

    setTimeout(() => {
        hideTypingIndicator();

        // Obtenir la réponse du bot
        const botResponse = getBotResponse(query);
        addMessage('bot', botResponse);

        isTyping = false;
    }, delay);
}

// Ajouter un message au chat
function addMessage(role, text) {
    messages.push({ role, text });

    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[85%] p-3 text-sm font-medium rounded-lg ${role === 'user'
            ? 'bg-red-700 text-white'
            : 'bg-white text-gray-800 shadow-sm border border-gray-200'
        }`;

    const textEl = document.createElement('p');
    textEl.className = 'whitespace-pre-wrap leading-relaxed';
    textEl.textContent = text;

    bubble.appendChild(textEl);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);

    // Scroll vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Afficher l'indicateur de frappe
function showTypingIndicator() {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex justify-start';

    typingDiv.innerHTML = `
        <div class="bg-white p-3 shadow-sm border border-gray-200 rounded-lg">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Masquer l'indicateur de frappe
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Exporter les fonctions
export default {
    initAssistant,
    openChat,
    closeChat
};
=======
/**
 * Assistant UI - Interface utilisateur pour le chatbot
 */

import { getBotResponse, getWelcomeMessage } from './chatbot.js';
import { showToast } from './ui.js';

let isTyping = false;
const messages = [];

// Initialiser l'assistant
export function initAssistant() {
    console.log('🎯 Initialisation de l\'assistant...');

    // Boutons de toggle
    const assistantButton = document.getElementById('assistant-button');
    const closeAssistant = document.getElementById('close-assistant');
    const chatForm = document.getElementById('chat-form');

    if (!assistantButton || !closeAssistant || !chatForm) {
        console.warn('⚠️ Éléments de l\'assistant non trouvés');
        return;
    }

    // Ouvrir le chat
    assistantButton.addEventListener('click', openChat);

    // Fermer le chat
    closeAssistant.addEventListener('click', closeChat);

    // Gérer l'envoi de messages
    chatForm.addEventListener('submit', handleSubmit);

    // Message de bienvenue personnalisé
    updateWelcomeMessage();
}

// Ouvrir le chat
function openChat() {
    const assistantButton = document.getElementById('assistant-button');
    const assistantChat = document.getElementById('assistant-chat');

    assistantButton.classList.add('hidden');
    assistantChat.classList.remove('hidden');

    // Focus sur l'input
    setTimeout(() => {
        document.getElementById('chat-input')?.focus();
    }, 300);
}

// Fermer le chat
function closeChat() {
    const assistantButton = document.getElementById('assistant-button');
    const assistantChat = document.getElementById('assistant-chat');

    assistantChat.classList.add('hidden');
    assistantButton.classList.remove('hidden');
}

// Mettre à jour le message de bienvenue
function updateWelcomeMessage() {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    // Supprimer l'ancien message de bienvenue
    const existingWelcome = messagesContainer.querySelector('.welcome-message');
    if (existingWelcome) {
        existingWelcome.remove();
    }

    // Ajouter le nouveau message de bienvenue
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'flex justify-start welcome-message';

    welcomeDiv.innerHTML = `
        <div class="max-w-[85%] p-3 text-sm font-medium bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg">
            <p class="whitespace-pre-wrap">${getWelcomeMessage()}</p>
        </div>
    `;

    messagesContainer.insertBefore(welcomeDiv, messagesContainer.firstChild);
}

// Gérer la soumission du formulaire
async function handleSubmit(e) {
    e.preventDefault();

    const input = document.getElementById('chat-input');
    const query = input.value.trim();

    if (!query || isTyping) return;

    // Ajouter le message utilisateur
    addMessage('user', query);
    input.value = '';

    // Afficher l'indicateur de frappe
    isTyping = true;
    showTypingIndicator();

    // Simuler un délai de réponse naturel (500-1500ms)
    const delay = 500 + Math.random() * 1000;

    setTimeout(() => {
        hideTypingIndicator();

        // Obtenir la réponse du bot
        const botResponse = getBotResponse(query);
        addMessage('bot', botResponse);

        isTyping = false;
    }, delay);
}

// Ajouter un message au chat
function addMessage(role, text) {
    messages.push({ role, text });

    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[85%] p-3 text-sm font-medium rounded-lg ${role === 'user'
            ? 'bg-red-700 text-white'
            : 'bg-white text-gray-800 shadow-sm border border-gray-200'
        }`;

    const textEl = document.createElement('p');
    textEl.className = 'whitespace-pre-wrap leading-relaxed';
    textEl.textContent = text;

    bubble.appendChild(textEl);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);

    // Scroll vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Afficher l'indicateur de frappe
function showTypingIndicator() {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex justify-start';

    typingDiv.innerHTML = `
        <div class="bg-white p-3 shadow-sm border border-gray-200 rounded-lg">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Masquer l'indicateur de frappe
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Exporter les fonctions
export default {
    initAssistant,
    openChat,
    closeChat
};
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
