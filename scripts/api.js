const PETS_URL = '../../assets/data/pets.json';

export async function getPets() {
    const response = await fetch(PETS_URL);

    if (!response.ok) {
        throw new Error('Failed to load pets.json');
    }

    return response.json();
}
