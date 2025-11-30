// Main application JavaScript

// Update current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Initialize app
console.log('GAL Web - Application initialisée');
