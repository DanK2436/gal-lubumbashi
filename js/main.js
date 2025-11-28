// Main application JavaScript
import { saveNewsletter } from './storage.js';
import { showToast } from './ui.js';

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-button');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });
}

// Update current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Newsletter subscription
const newsletterSubmit = document.getElementById('newsletter-submit');
if (newsletterSubmit) {
    newsletterSubmit.addEventListener('click', async () => {
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();

        if (!email) {
            showToast('Veuillez entrer une adresse email', 'warning');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Veuillez entrer une adresse email valide', 'warning');
            return;
        }

        try {
            await saveNewsletter(email);
            showToast('Merci de votre inscription à la newsletter !', 'success');
            emailInput.value = '';
        } catch (error) {
            console.error('Newsletter error:', error);
            showToast(error.message || 'Une erreur est survenue', 'error');
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize app
console.log('GAL Web - Application initialisée');
