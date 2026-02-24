const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;

// 1. Die Lade-Funktion
async function loadPokemon() {
    // 1. Button-Referenz holen und deaktivieren
    const btn = document.getElementById('loadMoreBTN');
    btn.disabled = true;
    btn.innerText = "Lädt..."; // Optional: Text ändern für besseres Feedback

    try {
        const url = `${BASE_URL}?offset=${currentOffset}&limit=${limit}`;
        let response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        
        let result = await response.json();

        renderPokemonCards(result.results);

        currentOffset += limit;
        
    } catch (error) {
        console.error("Da lief etwas schief beim Laden der Pokémon:", error.message);
    } finally {
        // 2. Button wieder aktivieren (egal ob Erfolg oder Fehler)
        btn.disabled = false;
        btn.innerText = "Mehr laden"; 
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