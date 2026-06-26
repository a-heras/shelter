import { getPets } from './api.js';
import { initBurgerMenu } from './burger.js';
import { initPetPopup } from './popup.js';
import { PetsSlider } from './slider.js';

document.addEventListener('DOMContentLoaded', async () => {
    initBurgerMenu();

    const slider = document.querySelector('.slider');

    try {
        const pets = await getPets();

        initPetPopup(pets);

        new PetsSlider({
            slider,
            pets,
        });
    } catch (error) {
        console.error(error);
    }
});
