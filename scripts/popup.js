function formatPetList(values) {
    if (!values?.length || (values.length === 1 && values[0] === 'none')) {
        return 'none';
    }

    return values.join(', ');
}

function createPopupElement() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup__overlay"></div>
        <div class="popup__window" role="dialog" aria-modal="true" aria-labelledby="popup-title">
            <button class="popup__close" type="button" aria-label="Close popup"></button>
            <img class="popup__image" src="" alt="" width="500" height="500" />
            <div class="popup__content">
                <h3 class="popup__title" id="popup-title"></h3>
                <p class="popup__subtitle"></p>
                <p class="popup__description"></p>
                <ul class="popup__list">
                    <li class="popup__item">
                        <span class="popup__label">Age:</span>
                        <span class="popup__value popup__value--age"></span>
                    </li>
                    <li class="popup__item">
                        <span class="popup__label">Inoculations:</span>
                        <span class="popup__value popup__value--inoculations"></span>
                    </li>
                    <li class="popup__item">
                        <span class="popup__label">Diseases:</span>
                        <span class="popup__value popup__value--diseases"></span>
                    </li>
                    <li class="popup__item">
                        <span class="popup__label">Parasites:</span>
                        <span class="popup__value popup__value--parasites"></span>
                    </li>
                </ul>
            </div>
        </div>
    `;

    return popup;
}

export function initPetPopup(pets) {
    const petsByName = new Map(pets.map((pet) => [pet.name, pet]));
    const popup = createPopupElement();
    document.body.append(popup);

    const closeButton = popup.querySelector('.popup__close');
    const image = popup.querySelector('.popup__image');
    const title = popup.querySelector('.popup__title');
    const subtitle = popup.querySelector('.popup__subtitle');
    const description = popup.querySelector('.popup__description');

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

    const fillPopup = (pet) => {
        image.src = pet.img;
        image.alt = pet.name;
        title.textContent = pet.name;
        subtitle.textContent = `${pet.type} - ${pet.breed}`;
        description.textContent = pet.description;
        popup.querySelector('.popup__value--age').textContent = pet.age;
        popup.querySelector('.popup__value--inoculations').textContent = formatPetList(pet.inoculations);
        popup.querySelector('.popup__value--diseases').textContent = formatPetList(pet.diseases);
        popup.querySelector('.popup__value--parasites').textContent = formatPetList(pet.parasites);
    };

    const closePopup = () => {
        popup.classList.remove('popup--open');
        unlockScroll();
    };

    const openPopup = (pet) => {
        fillPopup(pet);
        popup.classList.add('popup--open');
        lockScroll();
        closeButton.focus();
    };

    const handleDocumentClick = (event) => {
        const card = event.target.closest('.card');

        if (!card) {
            return;
        }

        const pet = petsByName.get(card.dataset.petName);

        if (!pet) {
            return;
        }

        openPopup(pet);
    };

    popup.addEventListener('click', (event) => {
        if (event.target.closest('.popup__window')) {
            return;
        }

        if (popup.classList.contains('popup--open')) {
            closePopup();
        }
    });

    closeButton.addEventListener('click', closePopup);

    document.addEventListener('click', handleDocumentClick);
}
