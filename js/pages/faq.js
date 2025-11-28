import { showToast } from '../ui.js';
import { initWhatsAppButtons } from '../whatsapp.js';
import { t } from '../i18n.js';

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
    { category: 'services', question: 'faq.q14.q', answer: 'faq.q14.a' }
];

let currentCategory = 'all';
let searchTerm = '';

// Create FAQ item
function createFaqItem(faq, index) {
    const item = document.createElement('div');
    item.className = 'border border-gray-200 p-6 hover:border-red-700 transition-colors cursor-pointer group rounded-lg bg-white';
    item.setAttribute('data-category', faq.category);

    item.innerHTML = `
        <button class="w-full flex justify-between items-center text-left focus:outline-none" aria-expanded="false" aria-controls="faq-answer-${index}">
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors pr-8">${t(faq.question)}</h3>
            <svg class="h-5 w-5 text-gray-400 group-hover:text-red-700 transition-transform duration-300 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        <div class="mt-4 text-gray-600 hidden leading-relaxed" id="faq-answer-${index}">
            <p>${t(faq.answer)}</p>
        </div>
    `;

    // Toggle handler
    const button = item.querySelector('button');
    const answer = item.querySelector('div[id^="faq-answer-"]');
    const icon = item.querySelector('svg');

    button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        // Close all other FAQ items
        document.querySelectorAll('#faq-accordion > div').forEach(otherItem => {
            if (otherItem !== item) {
                const otherBtn = otherItem.querySelector('button');
                const otherAns = otherItem.querySelector('div[id^="faq-answer-"]');
                const otherIcon = otherItem.querySelector('svg');

                otherBtn.setAttribute('aria-expanded', 'false');
                otherAns.classList.add('hidden');
                otherIcon.classList.remove('rotate-180');
            }
        });

        // Toggle current item
        if (isOpen) {
            button.setAttribute('aria-expanded', 'false');
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
        } else {
            button.setAttribute('aria-expanded', 'true');
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    });

    return item;
}

// Render FAQ
function renderFaq() {
    const accordion = document.getElementById('faq-accordion');
    const noResults = document.getElementById('no-results');

    if (!accordion || !noResults) return;

    // Filter FAQ
    const filtered = faqData.filter(faq => {
        const matchesCategory = currentCategory === 'all' || faq.category === currentCategory;
        const matchesSearch = !searchTerm ||
            t(faq.question).toLowerCase().includes(searchTerm.toLowerCase()) ||
            t(faq.answer).toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        accordion.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    accordion.classList.remove('hidden');
    noResults.classList.add('hidden');
    accordion.innerHTML = '';

    filtered.forEach((faq, index) => {
        const item = createFaqItem(faq, index);
        accordion.appendChild(item);
    });
}

export function init() {
    console.log('❓ Initializing FAQ page');

    // Category filter
    document.querySelectorAll('.faq-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.faq-category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderFaq();
        });
    });

    // Search
    const searchInput = document.getElementById('search-faq');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderFaq();
        });
    }

    // Init
    renderFaq();
    initWhatsAppButtons();
}
