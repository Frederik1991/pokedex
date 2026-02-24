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
        // Typ und Farbe bestimmen
        const type = pokemon.types[0].type.name;
        const color = TYPE_COLORS[type] || '#F5F5F5';
        
        // ID formatieren (ist jetzt direkt als Zahl verfügbar)
        const formattedId = pokemon.id.toString().padStart(3, '0');
        
        // Bildquelle (nutzen wir direkt aus dem geladenen Objekt)
        const imageUrl = pokemon.sprites.front_default;

        const cardHTML = `
            <div class="pokemonCard" style="background-color: ${color}">
                <p class="pokemon-id">#${formattedId}</p>
                <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image">
                <h3 class="pokemon-name">${pokemon.name.toUpperCase()}</h3>
                <p class="pokemon-type">Type: ${type}</p>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

loadPokemon();

document.getElementById('loadMoreBTN').addEventListener('click', loadPokemon);