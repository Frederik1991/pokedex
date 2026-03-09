function getCardHTMLTemplate(p, img, type) {
    return `
    <div class="pokemonCard" style="background-color: ${TYPE_COLORS[type] || '#F5F5F5'}">
        <p>#${p.id.toString().padStart(3, '0')}</p>
        <img src="${img}" class="pokemon-image">
        <h3 class="pokemon-name">${p.name.toUpperCase()}</h3>
        <div class="types-container">${p.types.map(t => '<span class="type-badge">' + t.type.name + '</span>').join('')}</div> </div>
`;
}

function getStatRowTemplate(s, percent) {
    return `
    <div class="stat-row">
        <span class="stat-name">${s.stat.name.toUpperCase()}</span>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${percent}%"></div></div>
        <span class="stat-number">${s.base_stat}</span> </div>
        `;
}

function showDetailsTemplate(p) {
   return `
    <h2>${p.name.toUpperCase()}</h2> 
    <p class="stat-number-id">#${p.id.toString().padStart(3, '0')}</p> 
    <img src="${p.sprites.other['official-artwork'].front_default}" style="width: 150px;"> 
    <div class="stats-container">${p.stats.map(getStatRow).join('')}</div>
    `;
}