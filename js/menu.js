// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    if (mobileMenuBtn) {
        const toggleMenu = (e) => {
            if (e && e.type === 'touchstart') e.preventDefault();
            const mobileMenu = document.getElementById('mobile-menu');
            const menuIcon = document.getElementById('menu-icon');
            const closeIcon = document.getElementById('close-icon');

            if (mobileMenu && menuIcon && closeIcon) {
                // Toggle Tailwind's hidden class and a permanent show class to override interfering CSS
                mobileMenu.classList.toggle('hidden');
                mobileMenu.classList.toggle('show-mobile-menu');
                menuIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');

                // Accessibility state
                const expanded = mobileMenu.classList.contains('show-mobile-menu');
                mobileMenu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
                mobileMenuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        mobileMenuBtn.addEventListener('touchstart', toggleMenu);
    }
});
