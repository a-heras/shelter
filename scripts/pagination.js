import { createCard } from './create-card.js';

const FADE_OUT_MS = 150;
const STAGGER_MS = 40;
const CARD_ANIM_MS = 350;

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function getCardsPerPage() {
    if (window.innerWidth >= 1280) {
        return 8;
    }

    if (window.innerWidth >= 768) {
        return 6;
    }

    return 3;
}

export class PetsPagination {
    constructor({ cardsContainer, paginationNav, petsList }) {
        this.cardsContainer = cardsContainer;
        this.petsList = petsList;
        this.currentPage = 1;
        this.isAnimating = false;
        this.cardsPerPage = getCardsPerPage();

        this.firstButton = paginationNav.querySelector('.pagination__button--first');
        this.prevButton = paginationNav.querySelector('.pagination__button--prev');
        this.pageButton = paginationNav.querySelector('.pagination__button--page');
        this.nextButton = paginationNav.querySelector('.pagination__button--next');
        this.lastButton = paginationNav.querySelector('.pagination__button--last');

        this.bindEvents();
        this.goToPage(1, 0, false);
    }

    getTotalPages() {
        return Math.ceil(this.petsList.length / this.cardsPerPage);
    }

    bindEvents() {
        this.firstButton.addEventListener('click', () => {
            if (this.firstButton.disabled) {
                return;
            }

            this.goToPage(1, -1);
        });

        this.prevButton.addEventListener('click', () => {
            if (this.prevButton.disabled) {
                return;
            }

            this.goToPage(this.currentPage - 1, -1);
        });

        this.nextButton.addEventListener('click', () => {
            if (this.nextButton.disabled) {
                return;
            }

            this.goToPage(this.currentPage + 1, 1);
        });

        this.lastButton.addEventListener('click', () => {
            if (this.lastButton.disabled) {
                return;
            }

            this.goToPage(this.getTotalPages(), 1);
        });

        window.addEventListener('resize', () => {
            const nextCardsPerPage = getCardsPerPage();

            if (nextCardsPerPage === this.cardsPerPage) {
                return;
            }

            const startIndex = (this.currentPage - 1) * this.cardsPerPage;
            this.cardsPerPage = nextCardsPerPage;
            this.currentPage = Math.min(
                Math.floor(startIndex / this.cardsPerPage) + 1,
                this.getTotalPages(),
            );
            this.goToPage(this.currentPage, 0, false);
        });
    }

    updateControls() {
        const totalPages = this.getTotalPages();
        const isFirstPage = this.currentPage === 1;
        const isLastPage = this.currentPage === totalPages;

        this.firstButton.disabled = isFirstPage;
        this.prevButton.disabled = isFirstPage;
        this.nextButton.disabled = isLastPage;
        this.lastButton.disabled = isLastPage;

        this.pageButton.textContent = String(this.currentPage);
        this.pageButton.dataset.page = String(this.currentPage);
        this.pageButton.setAttribute('aria-current', 'page');
    }

    getPagePets(page) {
        const start = (page - 1) * this.cardsPerPage;
        return this.petsList.slice(start, start + this.cardsPerPage);
    }

    renderCards(pets) {
        this.cardsContainer.replaceChildren(...pets.map(createCard));
    }

    async animateCards(pets) {
        this.cardsContainer.classList.add('our-friends__cards--hidden');
        await wait(FADE_OUT_MS);

        this.renderCards(pets);
        this.cardsContainer.classList.remove('our-friends__cards--hidden');

        const cards = [...this.cardsContainer.children];

        cards.forEach((card, index) => {
            card.style.setProperty('--card-delay', `${index * STAGGER_MS}ms`);
            card.classList.add('card--page-enter');
        });

        await wait(CARD_ANIM_MS + Math.max(0, cards.length - 1) * STAGGER_MS);

        cards.forEach((card) => {
            card.classList.remove('card--page-enter');
            card.style.removeProperty('--card-delay');
        });
    }

    async goToPage(page, direction = 0, animated = true) {
        if (this.isAnimating) {
            return;
        }

        const totalPages = this.getTotalPages();
        const targetPage = Math.min(Math.max(page, 1), totalPages);

        if (targetPage === this.currentPage && direction !== 0) {
            return;
        }

        const pagePets = this.getPagePets(targetPage);

        this.currentPage = targetPage;
        this.updateControls();

        this.isAnimating = animated && direction !== 0;

        if (animated && direction !== 0) {
            await this.animateCards(pagePets);
        } else {
            this.renderCards(pagePets);
        }

        this.isAnimating = false;
    }
}
