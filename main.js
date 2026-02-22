const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;

// 1. Die Lade-Funktion
async function loadPokemon() {
    try {
        const url = `${BASE_URL}?offset=${currentOffset}&limit=${limit}`;
        let response = await fetch(url);
        let result = await response.json();
        
        // Wir schicken die neuen 20 an die Render-Funktion
        renderPokemonCards(result.results);
        
        // Offset erhöhen für den nächsten Klick
        currentOffset += limit;
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

function renderPokemonCards(pokemonList) {
    const container = document.getElementById('pokemonContainer');

    // Diese Zeile muss weg: container.innerHTML = ''; 
    
    pokemonList.forEach((pokemon) => {
        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();

        const cardHTML = `
            <div class="pokemonCard">
                <p>#${pokemonId}</p>
                <h3>${pokemon.name.toUpperCase()}</h3>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

loadPokemon();

document.getElementById('loadMoreBTN').addEventListener('click', loadPokemon);