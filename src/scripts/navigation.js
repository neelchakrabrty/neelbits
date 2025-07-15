let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
        // Scrolling down — hide nav
        navbar.classList.add("-translate-y-full", "invisible", "pointer-events-none");
    } else {
        // Scrolling up — show nav
        navbar.classList.remove("-translate-y-full", "invisible", "pointer-events-none");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
