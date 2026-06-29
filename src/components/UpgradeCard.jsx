import { useUser } from "../contexts/UserContext";

function UpgradeCard({
  titulo = "Desbloqueie o Premium",
  descricao = "Recursos avançados para seu negócio",
  variant = "card",
  showPrice = true,
}) {
  const { usuario } = useUser();

  async function iniciarCheckout() {
    try {
      const res = await fetch(
        "https://backend-agenda-hgrd.onrender.com/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plano: "premium",
            email: usuario.email,
            userId: usuario.uid,
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      alert("Erro ao iniciar checkout.");
    }
  }

  return (
    <div style={{ ...styles.container, ...styles[variant] }}>
      
      <div style={styles.badge}>⭐ Premium</div>

      <h2>{titulo}</h2>
      <p>{descricao}</p>

      <ul style={styles.lista}>
        <li>Profissionais ilimitados</li>
        <li>Faturamento completo</li>
        <li>Ranking da equipe</li>
        <li>Suporte prioritário</li>
      </ul>

      {showPrice && (
        <div style={styles.preco}>
          <strong>R$ 19,90/mês</strong>
          <br />
          ou R$ 199,90/ano
        </div>
      )}

      <button style={styles.botao} onClick={iniciarCheckout}>
        Assinar Premium
      </button>
    </div>
  );
}

const styles = {
  container: {
    borderRadius: 16,
    padding: 20,
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    position: "relative",
  },

  card: {
    maxWidth: 420,
    margin: "0 auto",
  },

  modal: {
    width: "100%",
  },

  banner: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },

  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#4A6FFF",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
  },

  lista: {
    paddingLeft: 18,
    marginTop: 10,
  },

  preco: {
    marginTop: 15,
    fontSize: 14,
    color: "#374151",
  },

  botao: {
    width: "100%",
    marginTop: 15,
    padding: 12,
    background: "#4A6FFF",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default UpgradeCard;