const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;
let allLoadedPokemon = []; // Hier speichern wir alle Details

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

        allLoadedPokemon = [...allLoadedPokemon, ...pokemonDetailList]; // Liste erweitern
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
        const mainType = pokemon.types[0].type.name;
        const backgroundColor = TYPE_COLORS[mainType] || '#F5F5F5';
        const typesHTML = pokemon.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('');
        const formattedId = pokemon.id.toString().padStart(3, '0');
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        // 1. Wir erstellen das div-Element für die Karte
        const card = document.createElement('div');
        card.className = 'pokemonCard';
        card.style.backgroundColor = backgroundColor;

        // 2. Wir füllen das Innere der Karte (wie vorher)
        card.innerHTML = `
            <p class="pokemon-id">#${formattedId}</p>
            <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image">
            <h3 class="pokemon-name">${pokemon.name.toUpperCase()}</h3>
            <div class="types-container">
                ${typesHTML}
            </div>
        `;

        // 3. DER WICHTIGSTE SCHRITT: Klick-Event hinzufügen
        // Wenn man auf diese Karte klickt, wird die Funktion showDetails aufgerufen
        card.addEventListener('click', () => {
            showDetails(pokemon);
        });

        // 4. Die Karte in den Container packen
        container.appendChild(card);
    });
}

document.getElementById('pokemonSearch').addEventListener('input', function (event) {
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

function showDetails(pokemon) {
    const modal = document.getElementById('pokemonModal');
    const modalBody = document.getElementById('modalBody');

    const statsHTML = pokemon.stats.map(s => {
        const percent = Math.min(100, (s.base_stat / 200) * 100);
        return `
            <div class="stat-row">
                <span class="stat-name">${s.stat.name.toUpperCase()}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${percent}%"></div>
                </div>
                <span class="stat-number">${s.base_stat}</span>
            </div>
        `;
    }).join('');

    modalBody.innerHTML = `
        <h2 style="margin-bottom: 0;">${pokemon.name.toUpperCase()}</h2>
        <p style="color: #666;">#${pokemon.id.toString().padStart(3, '0')}</p>
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" style="width: 180px;">
        <p class="stat-number-id">#${pokemon.id.toString().padStart(3, '0')}</p>
        
        <div class="info-box" style="display: flex; justify-content: space-around; margin: 15px 0;">
            <span><strong>Weight:</strong> ${pokemon.weight / 10} kg</span>
            <span><strong>Height:</strong> ${pokemon.height / 10} m</span>
        </div>

        <div class="stats-container">
            ${statsHTML}
        </div>
    `;

    modal.classList.remove('hidden');
    // NEU: Scrollen im Hintergrund verhindern
    document.body.classList.add('no-scroll');
}

// --- Diese Funktionen kommen AUSSERHALB von showDetails ganz unten in dein Skript ---

function closeModal() {
    const modal = document.getElementById('pokemonModal');
    modal.classList.add('hidden');
    // NEU: Scrollen wieder erlauben
    document.body.classList.remove('no-scroll');
}

// Einmaliger Listener für Klicks außerhalb (Click-Outside)
window.addEventListener('click', (event) => {
    const modal = document.getElementById('pokemonModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Einmaliger Listener für die Escape-Taste
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});
const modal = document.getElementById('pokemonModal');

// 2. Auf Klicks im gesamten Fenster reagieren
window.addEventListener('click', (event) => {
    // Wenn das Ziel des Klicks genau das dunkle Overlay (modal) ist 
    // und nicht der weiße Kasten (modal-content) darin:
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});

function navigatePokemon(direction) {
    // 1. Aktuelles Pokémon im modalBody finden (über die ID)
    const currentId = parseInt(document.querySelector('.stat-number-id').innerText.replace('#', ''));
    
    // 2. Index im Array finden
    const currentIndex = allLoadedPokemon.findIndex(p => p.id === currentId);
    
    // 3. Neuen Index berechnen
    let newIndex = currentIndex + direction;

    // 4. Prüfen, ob wir am Ende oder Anfang sind
    if (newIndex >= 0 && newIndex < allLoadedPokemon.length) {
        showDetails(allLoadedPokemon[newIndex]);
    }
}

// Event Listener für die Buttons (einmalig am Ende des Skripts)
document.getElementById('prevBtn').onclick = (e) => { e.stopPropagation(); navigatePokemon(-1); };
document.getElementById('nextBtn').onclick = (e) => { e.stopPropagation(); navigatePokemon(1); };


loadPokemon();

document.getElementById('loadMoreBTN').addEventListener('click', loadPokemon);