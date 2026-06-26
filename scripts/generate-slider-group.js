function shuffle(array) {
    const result = [...array];

    for (let index = result.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }

    return result;
}

export function generateSliderGroup(pets, count, excludeNames = []) {
    const excludeSet = new Set(excludeNames);
    const availablePets = pets.filter((pet) => !excludeSet.has(pet.name));
    const uniquePets = shuffle(availablePets);

    return uniquePets.slice(0, count);
}
