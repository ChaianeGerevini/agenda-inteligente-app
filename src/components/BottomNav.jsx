import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <button onClick={() => navigate("/dashboard")} style={styles.btn(isActive("/dashboard"))}>
        🏠
        <span>Home</span>
      </button>

      <button onClick={() => navigate("/agenda")} style={styles.btn(isActive("/agenda"))}>
        📅
        <span>Agenda</span>
      </button>

      <button onClick={() => navigate("/clientes")} style={styles.btn(isActive("/clientes"))}>
        👤
        <span>Clientes</span>
      </button>

      <button onClick={() => navigate("/equipe")} style={styles.btn(isActive("/equipe"))}>
        👥
        <span>Equipe</span>
      </button>

      <button onClick={() => navigate("/perfil")} style={styles.btn(isActive("/perfil"))}>
        🙍
        <span>Perfil</span>
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    background: "#fff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #e5e7eb",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
  },

  btn: (active) => ({
    background: "transparent",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 11,
    color: active ? "#4A6FFF" : "#111827",
    fontWeight: active ? "600" : "400",
    cursor: "pointer",
  }),
};

export default BottomNav;