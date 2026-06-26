export function initBurgerMenu() {
    const header = document.querySelector('.header');

    if (!header) {
        return;
    }

    const burger = header.querySelector('.header__burger');
    const nav = header.querySelector('.header__nav');
    const links = nav.querySelectorAll('.header__link');

    let overlay = header.querySelector('.header__overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'header__overlay';
        header.appendChild(overlay);
    }

    const isMenuOpen = () => header.classList.contains('header--open');

    let scrollPosition = 0;

    const lockScroll = () => {
        scrollPosition = window.scrollY;
        document.documentElement.classList.add('page--no-scroll');
        document.body.classList.add('page--no-scroll');
        document.body.style.top = `-${scrollPosition}px`;
    };

    const unlockScroll = () => {
        const scrollBehavior = document.documentElement.style.scrollBehavior;

        document.documentElement.classList.remove('page--no-scroll');
        document.body.classList.remove('page--no-scroll');
        document.body.style.top = '';
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, scrollPosition);
        document.documentElement.style.scrollBehavior = scrollBehavior;
    };

    const closeMenu = (instant = false) => {
        if (instant) {
            header.classList.remove('header--animating');
        }

        header.classList.remove('header--open');
        burger.classList.remove('header__burger--open');
        burger.setAttribute('aria-label', 'Open menu');
        burger.setAttribute('aria-expanded', 'false');
        unlockScroll();

        if (!instant) {
            window.setTimeout(() => {
                header.classList.remove('header--animating');
            }, 300);
        }
    };

    const openMenu = () => {
        header.classList.add('header--animating');
        header.classList.add('header--open');
        burger.classList.add('header__burger--open');
        burger.setAttribute('aria-label', 'Close menu');
        burger.setAttribute('aria-expanded', 'true');
        lockScroll();
    };

    const toggleMenu = () => {
        if (isMenuOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    burger.setAttribute('aria-expanded', 'false');

    burger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    links.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
        if (isMenuOpen() || header.classList.contains('header--animating')) {
            closeMenu(true);
        }
    });
}
