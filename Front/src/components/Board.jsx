import './Board.css';

function Board({ attempts, results, currentRow, removePokemon }) {
  return (
    <div className="board">
      {attempts.map((row, rI) => (
        <div key={rI} className="row">
          {row.map((p, sI) => (
            <div
              key={sI}
              className={`slot ${results[rI][sI] || ""} ${rI === currentRow ? "active-slot" : ""}`}
              onClick={() => rI === currentRow && removePokemon(sI)}
            >
              {p && <img src={`/${p}.png`} alt={p} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
