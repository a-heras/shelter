import { createCard } from './create-card.js';
import { generateSliderGroup } from './generate-slider-group.js';

const SLIDE_MS = 500;

export function getSliderCardsCount() {
    if (window.innerWidth >= 1280) {
        return 3;
    }

    if (window.innerWidth >= 768) {
        return 2;
    }

    return 1;
}

function waitForTransition(element) {
    return new Promise((resolve) => {
        let isDone = false;

        const finish = () => {
            if (isDone) {
                return;
            }

            isDone = true;
            element.removeEventListener('transitionend', onTransitionEnd);
            resolve();
        };

        const onTransitionEnd = (event) => {
            if (event.target !== element || event.propertyName !== 'transform') {
                return;
            }

            finish();
        };

        element.addEventListener('transitionend', onTransitionEnd);
        setTimeout(finish, SLIDE_MS + 100);
    });
}

function nextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

function preloadImages(pets) {
    return Promise.all(
        pets.map(
            (pet) =>
                new Promise((resolve) => {
                    const image = new Image();
                    image.onload = resolve;
                    image.onerror = resolve;
                    image.src = pet.img;
                }),
        ),
    );
}

export class PetsSlider {
    constructor({ slider, pets }) {
        this.slider = slider;
        this.pets = pets;
        this.viewport = slider.querySelector('.slider__viewport');
        this.track = slider.querySelector('.slider__track');
        this.prevButton = slider.querySelector('.slider__button--prev');
        this.nextButton = slider.querySelector('.slider__button--next');
        this.cardsPerPage = getSliderCardsCount();
        this.currentGroup = [];
        this.history = [];
        this.isAnimating = false;

        this.bindEvents();
        this.renderInitialGroup();
    }

    bindEvents() {
        this.prevButton.addEventListener('click', () => {
            this.goPrev();
        });

        this.nextButton.addEventListener('click', () => {
            this.goNext();
        });

        window.addEventListener('resize', () => {
            const nextCardsPerPage = getSliderCardsCount();

            if (nextCardsPerPage === this.cardsPerPage) {
                return;
            }

            this.cardsPerPage = nextCardsPerPage;
            this.history = [];
            this.currentGroup = generateSliderGroup(this.pets, this.cardsPerPage);
            this.renderGroup(this.currentGroup);
        });
    }

    createSlide(pets) {
        const slide = document.createElement('div');
        slide.className = 'slider__slide';
        slide.append(...pets.map(createCard));

        return slide;
    }

    renderInitialGroup() {
        this.currentGroup = generateSliderGroup(this.pets, this.cardsPerPage);
        this.renderGroup(this.currentGroup);
    }

    renderGroup(pets) {
        this.track.replaceChildren(this.createSlide(pets));
        this.resetTrackPosition();
    }

    resetTrackPosition() {
        this.track.classList.add('slider__track--no-transition');
        this.track.style.transform = 'translate3d(0, 0, 0)';
        this.track.offsetHeight;
        this.track.classList.remove('slider__track--no-transition');
    }

    getGroupWidth() {
        return this.viewport.clientWidth;
    }

    snapTrackAfterNext() {
        const firstSlide = this.track.firstElementChild;

        this.track.classList.add('slider__track--no-transition');
        firstSlide.remove();
        this.track.style.transform = 'translate3d(0, 0, 0)';
        this.track.offsetHeight;
        this.track.classList.remove('slider__track--no-transition');
    }

    snapTrackAfterPrev() {
        const lastSlide = this.track.lastElementChild;

        this.track.classList.add('slider__track--no-transition');
        lastSlide.remove();
        this.track.style.transform = 'translate3d(0, 0, 0)';
        this.track.offsetHeight;
        this.track.classList.remove('slider__track--no-transition');
    }

    async slideNext(nextGroup) {
        await preloadImages(nextGroup);

        const groupWidth = Math.round(this.getGroupWidth());
        const nextSlide = this.createSlide(nextGroup);

        this.track.classList.add('slider__track--animating');
        this.track.append(nextSlide);
        await nextFrame();

        this.track.style.transform = `translate3d(-${groupWidth}px, 0, 0)`;
        await waitForTransition(this.track);
        await nextFrame();

        this.snapTrackAfterNext();
        this.track.classList.remove('slider__track--animating');
    }

    async slidePrev(prevGroup) {
        await preloadImages(prevGroup);

        const groupWidth = Math.round(this.getGroupWidth());
        const prevSlide = this.createSlide(prevGroup);

        this.track.classList.add('slider__track--animating');
        this.track.prepend(prevSlide);

        this.track.classList.add('slider__track--no-transition');
        this.track.style.transform = `translate3d(-${groupWidth}px, 0, 0)`;
        this.track.offsetHeight;
        this.track.classList.remove('slider__track--no-transition');

        await nextFrame();

        this.track.style.transform = 'translate3d(0, 0, 0)';
        await waitForTransition(this.track);
        await nextFrame();

        this.snapTrackAfterPrev();
        this.track.classList.remove('slider__track--animating');
    }

    async goNext() {
        if (this.isAnimating) {
            return;
        }

        const excludeNames = this.currentGroup.map((pet) => pet.name);
        const nextGroup = generateSliderGroup(this.pets, this.cardsPerPage, excludeNames);

        this.isAnimating = true;
        this.history.push(this.currentGroup);
        this.currentGroup = nextGroup;

        await this.slideNext(nextGroup);
        this.isAnimating = false;
    }

    async goPrev() {
        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;

        if (this.history.length > 0) {
            const prevGroup = this.history.pop();
            this.currentGroup = prevGroup;
            await this.slidePrev(prevGroup);
        } else {
            const excludeNames = this.currentGroup.map((pet) => pet.name);
            const prevGroup = generateSliderGroup(this.pets, this.cardsPerPage, excludeNames);

            this.currentGroup = prevGroup;
            await this.slidePrev(prevGroup);
        }

        this.isAnimating = false;
    }
}
