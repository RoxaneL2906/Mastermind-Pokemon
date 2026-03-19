import "./RulesModal.css";

function RulesModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>MASTERMIND POKÉMON</h2>

        <div className="rules-lang">
          <div className="lang-section">
            <h3>🇫🇷 RÈGLES DU JEU</h3>
            <p>Devinez le code secret de 5 Pokémon en 10 essais !</p>

            <div className="interaction-info">
              <p>👉 Cliquez sur un Pokémon en bas pour le placer.</p>
              <p>❌ Cliquez sur un Pokémon placé pour le retirer.</p>
            </div>

            <div className="color-legend">
              <p>
                <span className="dot green"></span> <strong>VERT :</strong>{" "}
                Bonne place
              </p>
              <p>
                <span className="dot yellow"></span> <strong>JAUNE :</strong>{" "}
                Mal placé
              </p>
              <p>
                <span className="dot red"></span> <strong>ROUGE :</strong> Pas
                dans le code secret
              </p>
            </div>

            <div className="mode-diff">
              <p>
                <strong>MODE EASY :</strong> Les 5 Pokémon sont tous différents
                (pas de doublons).
              </p>
              <p>
                <strong>MODE HARD :</strong> Le code peut contenir plusieurs
                fois le même Pokémon.
              </p>
            </div>
          </div>

          <div className="lang-divider"></div>

          <div className="lang-section">
            <h3>🇬🇧 GAME RULES</h3>
            <p>Guess the 5 secret Pokémon in 10 attempts!</p>

            <div className="interaction-info">
              <p>👉 Click a Pokémon at the bottom to place it.</p>
              <p>❌ Click a placed Pokémon to remove it.</p>
            </div>

            <div className="color-legend">
              <p>
                <span className="dot green"></span> <strong>GREEN:</strong>{" "}
                Right spot
              </p>
              <p>
                <span className="dot yellow"></span> <strong>YELLOW:</strong>{" "}
                Wrong spot
              </p>
              <p>
                <span className="dot red"></span> <strong>RED:</strong> Not in
                the secret code
              </p>
            </div>

            <div className="mode-diff">
              <p>
                <strong>EASY MODE:</strong> All 5 Pokémon are unique (no
                duplicates).
              </p>
              <p>
                <strong>HARD MODE:</strong> The code can contain the same
                Pokémon multiple times.
              </p>
            </div>
          </div>
        </div>

        <button className="close-rules" onClick={onClose}>
          GOT IT!
        </button>
      </div>
    </div>
  );
}

export default RulesModal;
