export function createCard(pet) {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.petName = pet.name;

    const image = document.createElement('img');
    image.className = 'card__image';
    image.src = pet.img;
    image.alt = pet.name;
    image.width = 270;
    image.height = 270;

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = pet.name;

    const button = document.createElement('button');
    button.className = 'card__button button button--secondary';
    button.type = 'button';
    button.textContent = 'Learn more';

    card.append(image, title, button);

    return card;
}
