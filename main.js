const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

async function loadPokemon() {
    try {
        let response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        let result = await response.json();
        
        // HIER ist die entscheidende Zeile:
        // Wir übergeben das Array 'results' an die Render-Funktion
        renderPokemonCards(result.results); 

    } catch (error) {
        console.error("Da lief etwas schief beim Laden der Pokémon:", error.message);
    }
}

function renderPokemonCards(pokemonList) {
    const container = document.getElementById('pokemonContainer');
    
    // Kleiner Tipp: Vor dem Laden leeren, falls du die Funktion mehrmals aufrufst
    // container.innerHTML = ''; 

    pokemonList.forEach((pokemon) => {
        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();

        const cardHTML = `
            <div class="pokemonCard">
                <p>#${pokemonId}</p>
                <h3>${pokemon.name}</h3>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

loadPokemon();