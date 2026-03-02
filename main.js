const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;
let allLoadedPokemon = [];

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

async function fetchPokemonDetails(results) {
    return Promise.all(results.map(async (p) => (await fetch(p.url)).json()));
}

async function loadPokemon() {
    toggleUIState(true);
    try {
        const url = `${BASE_URL}?offset=${currentOffset}&limit=${limit}`;
        const data = await (await fetch(url)).json();
        const details = await fetchPokemonDetails(data.results);
        allLoadedPokemon.push(...details);
        renderPokemonCards(details);
        currentOffset += limit;
    } catch (e) { console.error("Fehler:", e); }
    finally { toggleUIState(false); }
}

function toggleUIState(isLoading) {
    const btn = document.getElementById('loadMoreBTN');
    const loader = document.getElementById('loader');
    btn.disabled = isLoading;
    btn.innerText = isLoading ? "Lädt..." : "Mehr laden";
    loader.classList.toggle('hidden', !isLoading);
}

function getCardHTML(p) {
    const type = p.types[0].type.name;
    const img = p.sprites.other['official-artwork'].front_default;
    return`
    <div class="pokemonCard" style="background-color: ${TYPE_COLORS[type] || '#F5F5F5'}">
        <p>#${p.id.toString().padStart(3, '0')}</p>
        <img src="${img}" class="pokemon-image">
        <h3 class="pokemon-name">${p.name.toUpperCase()}</h3>
        <div class="types-container">${p.types.map(t => '<span class="type-badge">' + t.type.name + '</span>').join('')}</div> </div>;
`
}

function renderPokemonCards(list) {
    const container = document.getElementById('pokemonContainer');
    list.forEach(pokemon => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = getCardHTML(pokemon);
        const card = tempDiv.firstElementChild;
        card.onclick = () => showDetails(pokemon);
        container.appendChild(card);
    });
}

function getStatRow(s) {
    const percent = Math.min(100, (s.base_stat / 200) * 100);
    return `<div class="stat-row">
        <span class="stat-name">${s.stat.name.toUpperCase()}</span>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${percent}%"></div></div>
        <span class="stat-number">${s.base_stat}</span> </div>`;
}

function showDetails(p) {
    const body = document.getElementById('modalBody');
    body.innerHTML =
        `
    <h2>${p.name.toUpperCase()}</h2> 
    <p class="stat-number-id">#${p.id.toString().padStart(3, '0')}</p> 
    <img src="${p.sprites.other['official-artwork'].front_default}" style="width: 150px;"> 
    <div class="stats-container">${p.stats.map(getStatRow).join('')}</div>`;
    
    document.getElementById('pokemonModal').classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function navigatePokemon(direction) {
    const idTag = document.querySelector('.stat-number-id');
    if (!idTag) return;
    const currentId = parseInt(idTag.innerText.replace('#', ''));
    const index = allLoadedPokemon.findIndex(p => p.id === currentId);
    const newIdx = index + direction;
    if (newIdx >= 0 && newIdx < allLoadedPokemon.length) showDetails(allLoadedPokemon[newIdx]);
}

function closeModal() {
    document.getElementById('pokemonModal').classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

document.getElementById('pokemonSearch').addEventListener('input', (e) => {
const term = e.target.value.toLowerCase();
const cards = document.querySelectorAll('.pokemonCard');
cards.forEach(card => {
const name = card.querySelector('.pokemon-name').innerText.toLowerCase();
const shouldShow = term.length < 3 || name.includes(term);
card.style.display = shouldShow ? "flex" : "none";
});
});

window.addEventListener('click', (e) => e.target.id === 'pokemonModal' && closeModal());
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigatePokemon(-1);
    if (e.key === 'ArrowRight') navigatePokemon(1);
});

document.getElementById('prevBtn').onclick = (e) => { e.stopPropagation(); navigatePokemon(-1); };
document.getElementById('nextBtn').onclick = (e) => { e.stopPropagation(); navigatePokemon(1); };
document.getElementById('loadMoreBTN').addEventListener('click', loadPokemon);

loadPokemon();