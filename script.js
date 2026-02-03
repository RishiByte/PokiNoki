const grid = document.querySelector(".pokemon-grid");
const details = document.querySelector(".pokemon-details");
const searchInput = document.querySelector(".search-filter input");
const typeSelect = document.querySelector(".search-filter select");

let allPokemon = []; 

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await res.json();
}

function createCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}">
    <h3>${pokemon.name}</h3>
    <p>#${pokemon.id}</p>
  `;

  card.addEventListener("click", () => showDetails(pokemon));
  grid.appendChild(card);
}

function showDetails(pokemon) {
  details.innerHTML = `
    <div class="details-header">
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.other['official-artwork'].front_default}">
    </div>

    <div class="details-info">
      <p><strong>Height:</strong> ${pokemon.height}</p>
      <p><strong>Weight:</strong> ${pokemon.weight}</p>
      <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
      <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    </div>

    <div class="stats">
      <h3>Stats</h3>
      ${pokemon.stats.map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("")}
    </div>
  `;
}

function applyFilters() {
  const value = searchInput.value.trim().toLowerCase();
  const selectedType = (typeSelect && typeSelect.value) ? typeSelect.value.toLowerCase() : "all";

  grid.innerHTML = "";

  const filtered = allPokemon.filter(p => {
    const matchesName = p.name.toLowerCase().includes(value);
    if (selectedType === "all" || selectedType === "") return matchesName;

    const types = p.types.map(t => t.type.name.toLowerCase());
    const matchesType = types.includes(selectedType);
    return matchesName && matchesType;
  });

  filtered.forEach(createCard);
}

async function loadPokemon() {
  for (let i = 1; i <= 200; i++) {
    try {
      const pokemon = await fetchPokemon(i);
      allPokemon.push(pokemon);
      createCard(pokemon);
    } catch (err) {
      console.error('Failed to fetch pokemon', i, err);
    }
  }

  if (typeSelect) {
    const types = new Set();
    allPokemon.forEach(p => p.types.forEach(t => types.add(t.type.name)));


    typeSelect.innerHTML = "";
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All';
    typeSelect.appendChild(allOpt);

    Array.from(types).sort().forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      typeSelect.appendChild(opt);
    });
  }


  applyFilters();
}

loadPokemon();

searchInput.addEventListener("input", applyFilters);
if (typeSelect) typeSelect.addEventListener("change", applyFilters);

