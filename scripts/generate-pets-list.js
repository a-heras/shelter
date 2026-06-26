const TOTAL_CARDS = 48;

export function generatePetsList(pets) {
    const copiesPerPet = TOTAL_CARDS / pets.length;
    const counts = new Map(pets.map((pet) => [pet.name, 0]));
    const result = [];

    while (result.length < TOTAL_CARDS) {
        const lastPet = result[result.length - 1];
        const availablePets = pets.filter((pet) => {
            const hasCopiesLeft = counts.get(pet.name) < copiesPerPet;
            const isNotAdjacentDuplicate = !lastPet || lastPet.name !== pet.name;

            return hasCopiesLeft && isNotAdjacentDuplicate;
        });

        if (availablePets.length === 0) {
            return generatePetsList(pets);
        }

        const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
        result.push(randomPet);
        counts.set(randomPet.name, counts.get(randomPet.name) + 1);
    }

    return result;
}
