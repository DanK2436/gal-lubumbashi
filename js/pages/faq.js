import { showToast } from '../ui.js';
import { initWhatsAppButtons } from '../whatsapp.js';
import { t, initI18n } from '../i18n.js';

// FAQ Data
const faqData = [
    { category: 'adhesion', question: 'faq.q1.q', answer: 'faq.q1.a' },
    { category: 'adhesion', question: 'faq.q2.q', answer: 'faq.q2.a' },
    { category: 'adhesion', question: 'faq.q3.q', answer: 'faq.q3.a' },
    { category: 'formations', question: 'faq.q4.q', answer: 'faq.q4.a' },
    { category: 'formations', question: 'faq.q5.q', answer: 'faq.q5.a' },
    { category: 'formations', question: 'faq.q6.q', answer: 'faq.q6.a' },
    { category: 'machines', question: 'faq.q7.q', answer: 'faq.q7.a' },
    { category: 'machines', question: 'faq.q8.q', answer: 'faq.q8.a' },
    { category: 'machines', question: 'faq.q9.q', answer: 'faq.q9.a' },
    { category: 'machines', question: 'faq.q10.q', answer: 'faq.q10.a' },
    { category: 'services', question: 'faq.q11.q', answer: 'faq.q11.a' },
    { category: 'services', question: 'faq.q12.q', answer: 'faq.q12.a' },
    { category: 'services', question: 'faq.q13.q', answer: 'faq.q13.a' },
    { category: 'services', question: 'faq.q14.q', answer: 'faq.q14.a' },
    { category: 'machines', question: 'faq.q15.q', answer: 'faq.q15.a' },
    { category: 'machines', question: 'faq.q16.q', answer: 'faq.q16.a' },
    { category: 'formations', question: 'faq.q17.q', answer: 'faq.q17.a' },
    { category: 'services', question: 'faq.q18.q', answer: 'faq.q18.a' }
];

let currentCategory = 'all';
let searchTerm = '';

/**
 * Creates an individual FAQ accordion item
 */
function createFaqItem(faq, index) {
    const item = document.createElement('div');
    item.className = 'faq-item border border-gray-100 bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/5 hover:border-red-100 mb-4';
    item.setAttribute('data-category', faq.category);

    item.innerHTML = `
        <button class="w-full flex justify-between items-center p-6 text-left focus:outline-none group" aria-expanded="false" aria-controls="faq-answer-${index}">
            <h3 class="text-lg font-bold text-gray-800 group-hover:text-red-700 transition-colors pr-8 flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center text-sm font-black flex-shrink-0">${index + 1}</span>
                ${t(faq.question)}
            </h3>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <i class="ri-add-line text-xl text-gray-400 group-hover:text-red-700 transition-all duration-300 transform"></i>
            </div>
        </button>
        <div class="faq-content overflow-hidden max-h-0 transition-all duration-300 ease-in-out bg-slate-50/50" id="faq-answer-${index}">
            <div class="p-6 pt-0 text-gray-600 leading-relaxed border-t border-white">
                <div class="pl-11">
                    ${t(faq.answer)}
                </div>
            </div>
        </div>
    `;

    const button = item.querySelector('button');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('i');

    button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        // Close others
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) {
                const otherBtn = other.querySelector('button');
                const otherContent = other.querySelector('.faq-content');
                const otherIcon = other.querySelector('i');

                otherBtn.setAttribute('aria-expanded', 'false');
                otherContent.style.maxHeight = null;
                otherIcon.className = 'ri-add-line text-xl text-gray-400';
                other.classList.remove('border-red-200', 'bg-red-50/10');
            }
        });

        // Toggle current
        if (isOpen) {
            button.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = null;
            icon.className = 'ri-add-line text-xl text-gray-400';
            item.classList.remove('border-red-200', 'bg-red-50/10');
        } else {
            button.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + "px";
            icon.className = 'ri-subtract-line text-xl text-red-700';
            item.classList.add('border-red-200', 'bg-red-50/10');
        }
    });

    return item;
}

/**
 * Filters and renders FAQs
 */
function renderFaq() {
    const accordion = document.getElementById('faq-accordion');
    const noResults = document.getElementById('no-results');

    if (!accordion) return;

    const filtered = faqData.filter(faq => {
        const matchesCategory = currentCategory === 'all' || faq.category === currentCategory;
        const matchesSearch = !searchTerm ||
            t(faq.question).toLowerCase().includes(searchTerm.toLowerCase()) ||
            t(faq.answer).toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        accordion.classList.add('hidden');
        if (noResults) noResults.classList.remove('hidden');
        return;
    }

    accordion.classList.remove('hidden');
    if (noResults) noResults.classList.add('hidden');
    accordion.innerHTML = '';

    filtered.forEach((faq, index) => {
        const item = createFaqItem(faq, index);
        accordion.appendChild(item);
    });
}

/**
 * Main Initialization
 */
export function init() {
    // Category filters
    document.querySelectorAll('.faq-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.faq-category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderFaq();
        });
    });

    // Search bar
    const searchInput = document.getElementById('search-faq');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderFaq();
        });
    }

    renderFaq();
    initWhatsAppButtons();
}

// Global initialization
initI18n().then(() => {
    init();
});
