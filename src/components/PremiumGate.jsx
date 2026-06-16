import { useUser } from "../contexts/UserContext";

function PremiumGate({ tipo, children }) {
const { usuario, loadingUser, isPremium, isPlus } = useUser();

  if (loadingUser) {
    return null; // ou um loading spinner
  }

  if (!usuario) {
    return <p>Usuário não autenticado</p>;
  }

  const plano = usuario?.plano;

// LIBERA PREMIUM
if (tipo === "premium" && isPremium()) {
  return children;
}

// LIBERA PLUS
if (tipo === "plus" && isPlus()) {
  return children;
}

  // 🔒 BLOQUEADO → MOSTRA UPGRADE
  const iniciarCheckout = async (planoEscolhido) => {
    try {
      const res = await fetch("http://localhost:3001/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  plano: planoEscolhido,
  email: usuario?.email,
  userId: usuario?.uid,
}),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout");
      }
    } catch (err) {
  console.error("ERRO CHECKOUT:", err);
  alert("Erro ao iniciar checkout");
}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🔒</div>

        <h2 style={styles.titulo}>Acesso bloqueado</h2>

        <p style={styles.descricao}>
          Esse recurso faz parte do plano{" "}
          <b>{tipo === "plus" ? "Premium Plus" : "Premium"}</b>
        </p>

        <div style={styles.preco}>
          {tipo === "plus" ? "R$ 29,90/mês" : "R$ 9,90/mês"}
        </div>

        <button
          style={styles.botao}
          onClick={() =>
            iniciarCheckout(tipo === "plus" ? "plus" : "premium")
          }
        >
          Fazer upgrade
        </button>

        <p style={styles.rodape}>Cancele quando quiser.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    background: "#fff",
    borderRadius: 20,
    padding: 30,
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
  },

  icon: {
    fontSize: 50,
    marginBottom: 10,
  },

  titulo: {
    fontSize: 28,
    color: "#111827",
    marginBottom: 8,
  },

  descricao: {
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 1.5,
  },

  preco: {
    background: "#EEF2FF",
    color: "#4A6FFF",
    fontSize: 26,
    fontWeight: "bold",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },

  botao: {
    width: "100%",
    padding: 15,
    border: "none",
    borderRadius: 12,
    background: "#4A6FFF",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    cursor: "pointer",
  },

  rodape: {
    marginTop: 15,
    color: "#9CA3AF",
    fontSize: 12,
  },
};

export default PremiumGate;