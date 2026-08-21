import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";

function PaginaAgendamento() {
  const navigate = useNavigate();
  const { usuario } = useUser();

  const isPremium = usuario?.plano === "premium";
  const [loading, setLoading] = useState(false);

const iniciarCompra = async (tipo) => {
  if (!usuario?.uid || !usuario?.email) {
    alert("Não foi possível identificar seu usuário.");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      "https://backend-agenda-hgrd.onrender.com/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plano: tipo,
          userId: usuario.uid,
          email: usuario.email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro ao criar checkout.");
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error("Stripe não retornou uma URL de checkout.");

  } catch (error) {
    console.error("Erro ao iniciar compra:", error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

const comprarAutonomo = () => {
  iniciarCompra("paginaAutonomo");
};

const comprarEquipe = () => {
  iniciarCompra("paginaEquipe");
};

  return (
    <div style={styles.page}>

      {/* CABEÇALHO */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Página de Agendamento
          </h1>

          <p style={styles.subtitle}>
            Tenha sua própria página para receber agendamentos
            dos seus clientes.
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/")}
        >
          Voltar
        </button>
      </div>


      {/* VITRINE */}
      <div style={styles.plansContainer}>

        {/* AUTÔNOMO */}
        <div style={styles.card}>

          <div style={styles.cardHeader}>
            <span style={styles.badge}>
              AUTÔNOMO
            </span>

            <h2 style={styles.planTitle}>
              Página individual
            </h2>

            <p style={styles.planDescription}>
              Ideal para profissionais que trabalham
              sozinhos.
            </p>
          </div>


          <div style={styles.priceContainer}>
            <span style={styles.currency}>
              R$
            </span>

            <span style={styles.price}>
              29,90
            </span>

            <span style={styles.paymentType}>
              pagamento único
            </span>
          </div>


          <div style={styles.features}>

            <div style={styles.feature}>
              ✓ Página personalizada
            </div>

            <div style={styles.feature}>
              ✓ Logo
            </div>

            <div style={styles.feature}>
              ✓ Cor personalizada
            </div>

            <div style={styles.feature}>
              ✓ Cadastro de serviços
            </div>

            <div style={styles.feature}>
              ✓ Link exclusivo
            </div>

            <div style={styles.feature}>
              ✓ Agendamento online
            </div>

          </div>

        <button
  style={styles.primaryButton}
  onClick={comprarAutonomo}
  disabled={loading}
>
  {loading ? "Abrindo checkout..." : "Comprar página"}
</button>

        </div>


        {/* EQUIPE */}
        <div style={{
          ...styles.card,
          ...styles.teamCard
        }}>

          <div style={styles.recommended}>
            PARA EQUIPES
          </div>


          <div style={styles.cardHeader}>
            <span style={styles.badgeTeam}>
              EQUIPE
            </span>

            <h2 style={styles.planTitle}>
              Página para equipe
            </h2>

            <p style={styles.planDescription}>
              Para negócios que possuem vários
              profissionais.
            </p>
          </div>


          <div style={styles.priceContainer}>
            <span style={styles.currency}>
              R$
            </span>

            <span style={styles.price}>
              59,90
            </span>

            <span style={styles.paymentType}>
              pagamento único
            </span>
          </div>


          <div style={styles.features}>

            <div style={styles.feature}>
              ✓ Tudo do Autônomo
            </div>

            <div style={styles.feature}>
              ✓ Vários profissionais
            </div>

            <div style={styles.feature}>
              ✓ Cliente escolhe o profissional
            </div>

            <div style={styles.feature}>
              ✓ Agenda por profissional
            </div>

            <div style={styles.feature}>
              ✓ Link exclusivo
            </div>

            <div style={styles.feature}>
              ✓ Agendamento online
            </div>

          </div>


         {!isPremium && (
  <p style={styles.premiumMessage}>
    🔒 O plano Equipe está disponível apenas para usuários Premium.
  </p>
)}

<button
  style={isPremium ? styles.teamButton : styles.lockedButton}
  onClick={
    isPremium
      ? comprarEquipe
      : () => navigate("/faturamento")
  }
>
  {isPremium
    ? "Comprar página"
    : "🔒 Disponível no Premium"}
</button>

        </div>

      </div>


      {/* RODAPÉ DA VITRINE */}
      <div style={styles.footer}>

        <h3>
          Como funciona?
        </h3>

        <div style={styles.steps}>

          <div style={styles.step}>
            <strong>1</strong>
            <span>
              Escolha seu plano
            </span>
          </div>

          <div style={styles.step}>
            <strong>2</strong>
            <span>
              Personalize sua página
            </span>
          </div>

          <div style={styles.step}>
            <strong>3</strong>
            <span>
              Compartilhe seu link
            </span>
          </div>

          <div style={styles.step}>
            <strong>4</strong>
            <span>
              Receba agendamentos
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 30px",
    boxSizing: "border-box",
  },

  header: {
    maxWidth: 1100,
    margin: "0 auto 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },

  title: {
    margin: 0,
    fontSize: 32,
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },

  backButton: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    color: "#374151",
  },

  plansContainer: {
    maxWidth: 900,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 24,
    alignItems: "stretch",
  },

  card: {
    position: "relative",
    background: "#fff",
    borderRadius: 22,
    padding: 30,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  },

  teamCard: {
    border: "2px solid #4A6FFF",
  },

  recommended: {
    position: "absolute",
    top: 0,
    right: 25,
    transform: "translateY(-50%)",
    background: "#4A6FFF",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
  },

  cardHeader: {
    marginBottom: 20,
  },

  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 8,
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 11,
    fontWeight: 700,
  },

  badgeTeam: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 8,
    background: "#eef2ff",
    color: "#4A6FFF",
    fontSize: 11,
    fontWeight: 700,
  },

  planTitle: {
    margin: "14px 0 8px",
    fontSize: 23,
    color: "#111827",
  },

  planDescription: {
    margin: 0,
    color: "#6b7280",
    lineHeight: 1.5,
  },

  priceContainer: {
    marginBottom: 25,
  },

  currency: {
    fontSize: 18,
    color: "#374151",
    marginRight: 4,
  },

  price: {
    fontSize: 40,
    fontWeight: 800,
    color: "#111827",
  },

  paymentType: {
    display: "block",
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: 13,
    marginBottom: 30,
    flex: 1,
  },

  feature: {
    color: "#374151",
    fontSize: 14,
  },

  primaryButton: {
    width: "100%",
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    padding: "14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  },

  teamButton: {
    width: "100%",
    border: "none",
    background: "#111827",
    color: "#fff",
    padding: "14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  },

  footer: {
    maxWidth: 900,
    margin: "55px auto 0",
    textAlign: "center",
  },

  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 15,
    marginTop: 25,
  },

  step: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    color: "#4b5563",
    fontSize: 13,
  },
  lockedButton: {
  width: "100%",
  border: "none",
  background: "#e5e7eb",
  color: "#6b7280",
  padding: "14px",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 15,
},
premiumMessage: {
  background: "#f8fafc",
  borderRadius: 10,
  padding: "10px 12px",
  marginBottom: 12,
  color: "#6b7280",
  fontSize: 12,
  textAlign: "center",
  lineHeight: 1.4,
},

};


export default PaginaAgendamento;