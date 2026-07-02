import { useUser } from "../contexts/UserContext";

function RoleGate({ permitido, children }) {
  const { usuario, loadingUser } = useUser();

  if (loadingUser) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <div>Faça login para continuar.</div>;
  }

  // Verifica apenas o papel do usuário
  const roleAtual = usuario.role;

  if (!permitido.includes(roleAtual)) {
    return (
      <div style={styles.card}>
        <h2>🔒 Acesso restrito</h2>

        <p>Seu perfil não possui permissão para acessar esta área.</p>

        <div style={styles.info}>
          Seu perfil atual:
          <strong> {roleAtual}</strong>
        </div>
      </div>
    );
  }

  return children;
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F4F7FF",
    fontFamily: "Arial",
  },

  card: {
    maxWidth: 400,
    background: "#FFF",
    padding: 30,
    borderRadius: 20,
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    margin: 20,
    fontFamily: "Arial",
  },

  info: {
    marginTop: 15,
    background: "#EEF2FF",
    padding: 12,
    borderRadius: 10,
    color: "#4A6FFF",
    fontSize: 14,
  },
};

export default RoleGate;