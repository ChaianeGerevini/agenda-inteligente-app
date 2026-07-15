import UpgradeCard from "./UpgradeCard";

function PremiumOverlay({
  titulo = "Recurso Premium",
  descricao = " ",
  onUpgrade,
}) {
  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <h3>{titulo || "Premium"}</h3>

        <p>{descricao || "Faça upgrade para desbloquear esse recurso."}</p>

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
  backdropFilter: "blur(-90px)",
  background: "rgba(190, 180, 180, 0.09)",
  borderRadius: 20,
},

content: {
  textAlign: "center",
  padding: 10,
  fontSize: 12,
},

  card: {
    background: "rgba(255,255,255,.75)",
    backdropFilter: "blur(-50px)",
    padding: 15,
    borderRadius: 18,
    textAlign: "center",
    width: 50,
    boxShadow: "0 15px 35px rgba(0,0,0,.15)",
  },

  button: {
    marginTop: 0,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 400,
  },
};

export default PremiumOverlay;