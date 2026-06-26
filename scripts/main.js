import { getPets } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const pets = await getPets();
        console.log('Pets loaded:', pets.length, pets);
    } catch (error) {
        console.error(error);
    }
});
