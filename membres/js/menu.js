<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.member-nav-container');

    if (menuBtn && navContainer) {
        menuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            // Toggle icon between hamburger and close
            menuBtn.textContent = navContainer.classList.contains('active') ? '✕' : '☰';
        });
    }
});
=======
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.member-nav-container');

    if (menuBtn && navContainer) {
        menuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            // Toggle icon between hamburger and close
            menuBtn.textContent = navContainer.classList.contains('active') ? '✕' : '☰';
        });
    }
});
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
