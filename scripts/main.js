import { getPets } from './api.js';
import { initBurgerMenu } from './burger.js';
import { PetsSlider } from './slider.js';

document.addEventListener('DOMContentLoaded', async () => {
    initBurgerMenu();

    const slider = document.querySelector('.slider');

    try {
        const pets = await getPets();

        new PetsSlider({
            slider,
            pets,
        });
    } catch (error) {
        console.error(error);
    }
});
