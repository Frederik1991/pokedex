const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;

const TYPE_COLORS = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e1',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

// 1. Die Lade-Funktion
async function loadPokemon() {
    const btn = document.getElementById('loadMoreBTN');
    const loader = document.getElementById('loader');

    btn.disabled = true;
    btn.innerText = "Lädt...";
    loader.classList.remove('hidden');

    try {
        const url = `${BASE_URL}?offset=${currentOffset}&limit=${limit}`;
        let response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        
        let result = await response.json();

        // --- NEU: Detail-Daten für alle 20 Pokémon gleichzeitig holen ---
        const pokemonDetailList = await Promise.all(
            result.results.map(async (p) => {
                const res = await fetch(p.url); // Die individuelle URL aufrufen
                return await res.json();        // Das komplette Pokémon-Objekt zurückgeben
            })
        );

        // Wir übergeben jetzt die Liste mit ALLEN Infos (Typen, ID, Sprites)
        renderPokemonCards(pokemonDetailList);

        currentOffset += limit;

    } catch (error) {
        console.error("Fehler:", error.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Mehr laden";
        loader.classList.add('hidden');
    }
}

function renderPokemonCards(pokemonList) {
    const container = document.getElementById('pokemonContainer');

    pokemonList.forEach((pokemon) => {
        // 1. Hintergrundfarbe basierend auf dem ersten Typ
        const mainType = pokemon.types[0].type.name;
        const backgroundColor = TYPE_COLORS[mainType] || '#F5F5F5';

        // 2. HTML für ALLE Typen erstellen (Pillen-Design)
        const typesHTML = pokemon.types.map(t => 
            `<span class="type-badge">${t.type.name}</span>`
        ).join(''); // Verbindet die Spans zu einem String

        const formattedId = pokemon.id.toString().padStart(3, '0');
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        const cardHTML = `
            <div class="pokemonCard" style="background-color: ${backgroundColor}">
                <p class="pokemon-id">#${formattedId}</p>
                <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image">
                <h3 class="pokemon-name">${pokemon.name.toUpperCase()}</h3>
                <div class="types-container">
                    ${typesHTML}
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

document.getElementById('pokemonSearch').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allCards = document.querySelectorAll('.pokemonCard');

    // Bedingung: Erst ab mehr als 3 Buchstaben suchen
    if (searchTerm.length >= 3) {
        allCards.forEach(card => {
            const name = card.querySelector('.pokemon-name').innerText.toLowerCase();
            
            if (name.includes(searchTerm)) {
                card.style.display = "flex"; // Anzeigen
            } else {
                card.style.display = "none"; // Verstecken
            }
        });
    } else {
        // Wenn weniger als 4 Zeichen: Alle wieder anzeigen
        allCards.forEach(card => card.style.display = "flex");
    }
});

loadPokemon();

document.getElementById('loadMoreBTN').addEventListener('click', loadPokemon);