import { saveNewsletter } from './storage.js';
import { showToast } from './ui.js';

// Event delegation to handle form submission reliably
document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'footer-newsletter-form') {
        handleNewsletterSubmit(e);
    }
});

export function initNewsletter() {
    console.log('📧 Newsletter system ready (event delegation)');
    // Visual check for debugging
    const form = document.getElementById('footer-newsletter-form');
    if (form) {
        form.dataset.ready = 'true';
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    console.log('📨 Tentative d\'abonnement newsletter...');

    const emailInput = document.getElementById('footer-newsletter-email');
    if (!emailInput) {
        console.error('❌ Champ email introuvable');
        return;
    }

    const email = emailInput.value.trim();
    console.log('📧 Email:', email);

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
        console.log('✅ Abonnement réussi');
        showToast('🎉 Merci pour votre abonnement ! Vous recevrez nos dernières nouvelles.', 'success');
        emailInput.value = '';
    } catch (error) {
        console.error('❌ Erreur newsletter:', error);
        // If error is "email already exists", show a friendly message
        if (error.message && error.message.includes('déjà inscrit')) {
            showToast('Vous êtes déjà abonné à notre newsletter !', 'info');
        } else {
            showToast(error.message || 'Une erreur est survenue', 'error');
        }
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletter);
} else {
    initNewsletter();
}
