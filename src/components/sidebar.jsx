import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase"; 

function Sidebar({
isOpen,
  onClose,
  aba,
  setAba,
  notificacoes,
  setNotificacoes,
  onOpenPerfil,
  onOpenSeguranca,
  onOpenPlanos,
  onOpenSuporte
}) {

const navigate = useNavigate();

const onLogout = async () => {
  try {
    await signOut(auth);
    navigate("/");
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
};
  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY */}
      <div style={styles.overlay} onClick={onClose} />

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>  Configurações</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* MENU */}
        <nav style={styles.menu}>
          <button
          style={styles.btn}
            onClick={() => {
  onClose();
  onOpenPerfil();
}}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen-icon lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>  Editar perfil
          </button>

          <button
style={styles.btn}
onClick={() => {
  onClose();
  onOpenSeguranca();
}}          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>   Segurança
          </button>

          <button
style={styles.activePlanBtn}
onClick={() => {
  onClose();
  onOpenPlanos();
}}          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem-icon lucide-gem"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/></svg>  Gerenciar Assinatura
          </button>
<button
  style={styles.btn}
  onClick={() => {
    onClose();
    navigate("/pagina-agendamento");
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#537fb9ff"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h2" />
    <path d="M14 14h2" />
    <path d="M8 18h2" />
  </svg>

  Página de Agendamento
</button>
          <button
style={styles.btn}
onClick={() => {
  onClose();
  onOpenSuporte();
}}          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headset-icon lucide-headset"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/></svg>  Suporte
          </button>

<button 
  style={styles.btn}
  onClick={() => {
    onClose();
    navigate("/indique");
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gift-icon lucide-gift"><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg> Indique e Ganhe
</button>

          <button 
  style={styles.logoutBtn} 
  onClick={onLogout}
>
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a75050ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-power-off-icon lucide-power-off"><path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/><path d="M12 2v4"/><path d="m2 2 20 20"/></svg>  Sair
          </button>
        </nav>

        <div style={styles.content}>
          {aba === "notificacoes" && (
  <>
    <div style={styles.headerContent}>
      <h3> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6683ceff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg> Notificações
          </h3>

      <button
        style={{...styles.clearBtn, marginright: "auto", }}
        onClick={() => setNotificacoes([])}
      >
        Limpar
        
      </button>
    </div>

    {notificacoes.length === 0 ? (
      <p>Nenhuma notificação.</p>
    ) : (
      notificacoes.map((item) => (
        <div
          key={item.id}
          style={styles.notificationCard}
        >
          {item.texto}
        </div>
      ))
    )}
  </>
)}

        </div>
        
        </aside>

        
    </>
    
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    zIndex: 1000,
  },

  sidebar: {
    position: "fixed",
    right: 0,
    top: 0,
    width: 380,
    height: "100%",
    background: "#fff",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.2)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    borderBottom: "1px solid #eee",
  },

  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
    gap: 6,
  },

btn: {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 12,
  border: "none",
  background: "transparent",
  textAlign: "left",
  cursor: "pointer",
  borderRadius: 10,
},

  activeBtn: {
    padding: 10,
    border: "none",
    background: "#f0f0f0",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: 6,
  },

  activePlanBtn: {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 12,
  background: "#EEF2FF",
  borderRadius: 10,
  color: "#4A6FFF",
  fontWeight: 700,
},

  logoutBtn: {
    marginTop: 10,
    padding: 10,
    border: "none",
    background: "transparent",
    color: "red",
    textAlign: "left",
    cursor: "pointer",
  },

  headerContent: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: 15,
},

clearBtn: {
  border: "none",
  background: "#EEF2FF",
  color: "#4A6FFF",
  padding: "8px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  transition: "0.2s",
  marginLeft: "auto",
},
};

export default Sidebar;