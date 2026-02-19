async function loadCharacters() {
    const response = await fetch('data/characters.json');
    const characters = await response.json();

    const container = document.getElementById('character-list');
    container.innerHTML = '';

    characters.forEach(character => {
        const div = document.createElement('div');
        div.className = 'character';
        div.innerHTML = `
            <h2>${character.name}</h2>
            <p>Class: ${character.class}</p>
            <p>Weight: ${character.weight}</p>
        `;
        container.appendChild(div);
    });
}

loadCharacters();