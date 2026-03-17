import "./SelectionArea.css";

function SelectionArea({ ALL_POKEMON, selectPokemon }) {
  return (
    /* SELECTION AREA */
    <div className="selection-area">
      <div className="pokemon-list">
        {ALL_POKEMON.map((p) => (
          <button
            key={p}
            className="pokemon-btn"
            onClick={() => selectPokemon(p)}
          >
            <img src={`/${p}.png`} alt={p} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectionArea;
