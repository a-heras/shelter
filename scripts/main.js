import { getPets } from './api.js';
import { initBurgerMenu } from './burger.js';

document.addEventListener('DOMContentLoaded', async () => {
    initBurgerMenu();

    try {
        const pets = await getPets();
        console.log('Pets loaded:', pets.length, pets);
    } catch (error) {
        console.error(error);
    }
});
