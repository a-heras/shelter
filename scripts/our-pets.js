import { getPets } from './api.js';
import { generatePetsList } from './generate-pets-list.js';
import { PetsPagination } from './pagination.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cardsContainer = document.querySelector('.our-friends__cards');
    const paginationNav = document.querySelector('.pagination');

    try {
        const pets = await getPets();
        const petsList = generatePetsList(pets);

        new PetsPagination({
            cardsContainer,
            paginationNav,
            petsList,
        });
    } catch (error) {
        console.error(error);
    }
});
