import { useUser } from "../contexts/UserContext";
import UpgradeCard from "./UpgradeCard";
function PremiumGate({ children }) {
const { usuario, loadingUser, isPremium } = useUser();

  if (loadingUser) {
    return null; // ou um loading spinner
  }

  if (!usuario) {
    return <p>Usuário não autenticado</p>;
  }


if (isPremium()) {
  return children;
}

  return (
  <UpgradeCard
    titulo="Recurso Premium"
    descricao="Faça upgrade para liberar essa funcionalidade."
    variant="card"
  />
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