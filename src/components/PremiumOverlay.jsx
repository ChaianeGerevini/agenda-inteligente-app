import UpgradeCard from "./UpgradeCard";

function PremiumOverlay({
  titulo = "Recurso Premium",
  descricao = " ",
  onUpgrade,
}) {

  console.log("PREMIUM OVERLAY CARREGOU");
  return (
    <div style={styles.overlay}>
      <div style={styles.content}>

<div style={styles.card}>
  <h3 style={styles.title}>{titulo}</h3>

  <p style={styles.description}>
    {descricao}
  </p>

  <button
    style={styles.button}
    onClick={onUpgrade}
  >
    Fazer upgrade
  </button>
</div>

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
      backdropFilter: "blur(-90px)",
  background: "rgba(190, 180, 180, 0.09)",
    borderRadius: 20,
  },

  content: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: 15,
  },

   card: {
    width: "90%",
    maxWidth: 320,
    textAlign: "center",
  },

  button: {
    width: "100%",
    padding: 10,
    border: "none",
    borderRadius: 16,
    background: "#4A6FFF",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },

  description: {
    marginTop: 12,
    marginBottom: 22,
    fontSize: 12,
    color: "#111",
  },

};

export default PremiumOverlay;