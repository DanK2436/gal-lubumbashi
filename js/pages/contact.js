import { saveContact } from '../storage.js';
import { showToast } from '../ui.js';
import { initWhatsAppButtons } from '../whatsapp.js';
import { t, initI18n } from '../i18n.js';

export function init() {
    console.log('Initializing Contact Page...');
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        console.log('Contact form found, attaching listener.');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted');

            // Récupérer les valeurs directement depuis le formulaire
            const formData = {
                name: contactForm.querySelector('#contact-name').value,
                email: contactForm.querySelector('#contact-email').value,
                phone: contactForm.querySelector('#contact-phone').value,
                subject: contactForm.querySelector('#contact-subject').value,
                message: contactForm.querySelector('#contact-message').value,
                created_at: new Date().toISOString()
            };

            try {
                // Save to localStorage (mock backend)
                await saveContact(formData);

                showToast(t('contact.success'), 'success');

                // Reset form
                contactForm.reset();

                // Afficher le message de succès intégré aussi (optionnel, pour redondance visuelle)
                const successMsg = document.getElementById('success-message');
                if (successMsg) {
                    successMsg.classList.remove('hidden');
                    setTimeout(() => successMsg.classList.add('hidden'), 5000);
                }

                console.log('Contact form submitted successfully:', formData);
            } catch (error) {
                console.error('Erreur:', error);
                showToast(t('contact.error'), 'error');

                const errorMsg = document.getElementById('error-message');
                if (errorMsg) {
                    errorMsg.classList.remove('hidden');
                    setTimeout(() => errorMsg.classList.add('hidden'), 5000);
                }
            }
        });
    } else {
        console.error('Contact form NOT found in DOM');
    }

    // Init WhatsApp buttons
    initWhatsAppButtons();
}

// Auto-initialize
initI18n().then(init);
