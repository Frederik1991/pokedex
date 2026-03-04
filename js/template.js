function getCardHTMLTemplate(p, img, type) {
    return `
    <div class="pokemonCard" style="background-color: ${TYPE_COLORS[type] || '#F5F5F5'}">
        <p>#${p.id.toString().padStart(3, '0')}</p>
        <img src="${img}" class="pokemon-image">
        <h3 class="pokemon-name">${p.name.toUpperCase()}</h3>
        <div class="types-container">${p.types.map(t => '<span class="type-badge">' + t.type.name + '</span>').join('')}</div> </div>
`;
}