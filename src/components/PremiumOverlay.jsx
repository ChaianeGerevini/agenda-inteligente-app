import UpgradeCard from "./UpgradeCard";

function PremiumOverlay({ onUpgrade }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h3>🔒 Premium</h3>

        <p>
          Faça upgrade para desbloquear esse relatório.
        </p>

        <button
          style={styles.button}
          onClick={onUpgrade}
        >
          Fazer upgrade
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(6px)",
    background: "rgba(255,255,255,.35)",
    borderRadius: 20,
  },

  card: {
    background: "rgba(255,255,255,.75)",
    backdropFilter: "blur(20px)",
    padding: 18,
    borderRadius: 18,
    textAlign: "center",
    width: 220,
    boxShadow: "0 15px 35px rgba(0,0,0,.15)",
  },

  button: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default PremiumOverlay;