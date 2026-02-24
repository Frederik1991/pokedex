const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;

// 1. Die Lade-Funktion
async function loadPokemon() {
    const btn = document.getElementById('loadMoreBTN');
    const loader = document.getElementById('loader'); // Spinner holen

    // 1. UI vorbereiten
    btn.disabled = true;
    loader.classList.remove('hidden'); // Spinner zeigen

    try {
        const url = `${BASE_URL}?offset=${currentOffset}&limit=${limit}`;
        let response = await fetch(url);
        if (!response.ok) throw new Error("Fehler");
        
        let result = await response.json();
        renderPokemonCards(result.results);
        currentOffset += limit;
        
    } catch (error) {
        console.error(error.message);
    } finally {
        // 2. UI zurücksetzen
        btn.disabled = false;
        loader.classList.add('hidden'); // Spinner wieder verstecken
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