<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.member-nav-container');

    if (mobileBtn && navContainer) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navContainer.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && !mobileBtn.contains(e.target)) {
                navContainer.classList.remove('active');
            }
        });
    }
});
=======
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.member-nav-container');

    if (mobileBtn && navContainer) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navContainer.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && !mobileBtn.contains(e.target)) {
                navContainer.classList.remove('active');
            }
        });
    }
});
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
