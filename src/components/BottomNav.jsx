import { useNavigate, useLocation } from "react-router-dom";
import { useUi } from "../contexts/UiContext";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setModalNovoAgendamento } = useUi();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>

      <button
        type="button"
        onClick={() => navigate("/agenda")}
        style={styles.btn(isActive("/agenda"))}
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a6fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><span>Agenda</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/clientes")}
        style={styles.btn(isActive("/clientes"))}
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a6fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen-icon lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg><span>Clientes</span>
      </button>

      <button
        type="button"
        onClick={() => setModalNovoAgendamento(true)}
        style={styles.fab}
      >
        +
      </button>

      <button
        type="button"
        onClick={() => navigate("/equipe")}
        style={styles.btn(isActive("/equipe"))}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a6fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg> <span>Equipe</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/Faturamento")}
        style={styles.btn(isActive("/dashboard"))}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a6fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt-icon lucide-receipt"><path d="M12 17V7"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"/><path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/></svg> <span>Faturamento</span>
      </button>

    </nav>
  );
}

const styles = {
  nav: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    height: 70,
    borderRadius: 20,
    background: "#ffff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #e5e7eb",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
    zIndex: 1000,
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
    gap: 2,
  }),

  fab: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    boxShadow: "0 10px 20px rgba(74,111,255,0.4)",
    cursor: "pointer",
  },
};

export default BottomNav;