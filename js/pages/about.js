import { initWhatsAppButtons } from '../whatsapp.js';
import { initI18n } from '../i18n.js';

function animateNumber(element, start, end, duration) {
    const increment = (end - start) / (duration / 16);
    let current = start;
    const suffix = element.textContent.replace(/[0-9]/g, '');

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Animate stats on scroll
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text);

                if (!isNaN(number)) {
                    animateNumber(target, 0, number, 2000);
                }

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

export function init() {
    initWhatsAppButtons();
    animateStats();
}

// Auto-initialize
initI18n().then(init);
