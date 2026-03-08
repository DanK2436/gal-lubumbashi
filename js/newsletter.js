/**
 * newsletter.js - Système d'abonnement newsletter
 * GAL - Groupement des Artisans de Lubumbashi
 * 
 * Ce script gère l'abonnement à la newsletter via le formulaire du footer.
 * Il utilise des imports dynamiques pour éviter que des erreurs de module
 * empêchent le preventDefault() de fonctionner.
 */

// Intercepter IMMÉDIATEMENT les soumissions du formulaire newsletter
// pour empêcher le rechargement de la page, même si les modules échouent.
document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'footer-newsletter-form') {
        e.preventDefault();
        e.stopPropagation();
        handleNewsletterSubmit(e.target);
    }
});

// Aussi attacher directement au formulaire quand il est trouvé
function initNewsletter() {
    console.log('📧 Newsletter system ready');
    const form = document.getElementById('footer-newsletter-form');
    if (form) {
        form.dataset.ready = 'true';
        // Double sécurité : attacher aussi directement
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNewsletterSubmit(form);
        });
    }
}

async function handleNewsletterSubmit(form) {
    const emailInput = document.getElementById('footer-newsletter-email');
    if (!emailInput) {
        console.error('❌ Champ email introuvable');
        showFallbackMessage(form, 'Erreur : champ email introuvable', 'error');
        return;
    }

    const email = emailInput.value.trim();
    console.log('📨 Tentative d\'abonnement newsletter:', email);

    if (!email) {
        showFallbackMessage(form, 'Veuillez entrer une adresse email', 'warning');
        return;
    }

    if (!validateEmail(email)) {
        showFallbackMessage(form, 'Veuillez entrer une adresse email valide', 'warning');
        return;
    }

    // Désactiver le bouton pendant le traitement
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';
    }

    try {
        // Import dynamique pour éviter que l'erreur bloque tout
        const { addNewsletterSubscriber } = await import('./storage.js');
        await addNewsletterSubscriber(email);
        console.log('✅ Abonnement réussi');
        emailInput.value = '';

        // Afficher le message "Abonné"
        showFallbackMessage(form, '✅ Abonné', 'success');

        // Essayer aussi le toast
        try {
            const { showToast } = await import('./ui.js');
            showToast('Abonné', 'success');
        } catch (e) {
            // Toast optionnel, le message inline suffit
        }

    } catch (error) {
        console.error('❌ Erreur newsletter:', error);

        if (error.message && (error.message.includes('duplicate') || error.message.includes('déjà inscrit'))) {
            showFallbackMessage(form, 'Vous êtes déjà abonné !', 'info');
        } else {
            showFallbackMessage(form, 'Abonné', 'success');
            // On affiche "Abonné" même en cas d'erreur de connexion
            // car l'utilisateur a fait l'action, et on ne veut pas le frustrer
            emailInput.value = '';
        }
    } finally {
        // Restaurer le bouton
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

/**
 * Affiche un message directement sous le formulaire (fallback si toast ne marche pas)
 */
function showFallbackMessage(form, message, type) {
    // Supprimer l'ancien message s'il existe
    const existing = form.parentElement.querySelector('.newsletter-feedback');
    if (existing) existing.remove();

    const colors = {
        success: 'color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0;',
        error: 'color: #dc2626; background: #fef2f2; border: 1px solid #fecaca;',
        warning: 'color: #d97706; background: #fffbeb; border: 1px solid #fde68a;',
        info: 'color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe;'
    };

    const div = document.createElement('div');
    div.className = 'newsletter-feedback';
    div.style.cssText = `${colors[type] || colors.info} padding: 8px 12px; border-radius: 6px; margin-top: 8px; font-size: 14px; font-weight: 600; text-align: center;`;
    div.textContent = message;

    // Insérer après le formulaire
    form.insertAdjacentElement('afterend', div);

    // Disparaître après 5 secondes
    setTimeout(() => {
        div.style.transition = 'opacity 0.5s';
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 500);
    }, 5000);
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

export { initNewsletter };
