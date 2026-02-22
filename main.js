const BASE_URL = "https://pokeapi.co/api/v2/pokemon"; // Direkt zum Ziel

async function loadPokemon() {
    try {
        let response = await fetch(BASE_URL);

        // Prüfung: War die Server-Antwort erfolgreich (Status 200-299)?
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        let result = await response.json();
        console.log("Erfolgreich geladen:", result);

    } catch (error) {
        // Hier landet alles: Netzwerkfehler, falsche URLs oder der manuelle Error von oben
        console.error("Da lief etwas schief beim Laden der Pokémon:", error.message);
        
        // Tipp: Hier könntest du dem Nutzer eine Nachricht auf der Webseite anzeigen
    }
}

loadPokemon();