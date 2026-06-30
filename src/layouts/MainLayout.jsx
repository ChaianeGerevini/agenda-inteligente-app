import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ModalNovoAtendimento from "../components/ModalNovoAtendimento";
import Sidebar from "../components/sidebar";
import { useUser } from "../contexts/UserContext";
import logo from "/src/assets/agendly-logo.jpg";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
   doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../services/firebase";




function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notificacoes, setNotificacoes] = useState([]);
  const totalNotificacoes = notificacoes.length;
  const [abaSidebar, setAbaSidebar] = useState("perfil");
  const [mensagemSuporte, setMensagemSuporte] =
  useState("");
  const [contatoSuporte, setContatoSuporte] =
  useState("");

  const [modalPlanos, setModalPlanos] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalSeguranca, setModalSeguranca] = useState(false);
  const [modalSuporte, setModalSuporte] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [nomePerfil, setNomePerfil] = useState("");
  const [empresaPerfil, setEmpresaPerfil] = useState("");
  const [telefonePerfil, setTelefonePerfil] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
 const [senhaAtual, setSenhaAtual] = useState("");
const [novaSenha, setNovaSenha] = useState("");
const [confirmarSenha, setConfirmarSenha] = useState("");
const { getPlanoAtual } = useUser();
const precisaSerPremium = (callback) => {
  if (!isPremium && (!diasRestantes || diasRestantes <= 0)) {
    setModalPlanos(true);
    return;
  }

  callback?.();
};

const planoAtual = getPlanoAtual();
const isPremium = planoAtual?.tipo === "premium";
const isFree = planoAtual?.tipo === "free";
const diasRestantes = planoAtual?.diasRestantes;
const iniciarCheckout = async (plano) => {
  try {
    console.log("CLICK CHECKOUT:", plano);

    if (!usuario?.email || !usuario?.uid) {
      alert("Usuário não carregado ainda");
      return;
    }

    const res = await fetch("https://backend-agenda-hgrd.onrender.com/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plano,
        email: usuario.email,
        userId: usuario.uid,
      }),
    });

    const data = await res.json();

    console.log("RESPOSTA CHECKOUT:", data);

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao iniciar checkout");
    }
  } catch (err) {
    console.error("ERRO CHECKOUT:", err);
    alert("Erro no checkout");
  }
};
const enviarSuporte = async () => {
  try {

    await addDoc(
      collection(db, "suporte"),
      {
        usuarioId: usuario.uid,
        nome: nomePerfil,
        empresa: empresaPerfil,
        emailConta: usuario.email,
        contatoRetorno: contatoSuporte,

        mensagem: mensagemSuporte,

        status: "pendente",

        dataCriacao: serverTimestamp(),
      }
    );

    alert(
      "Solicitação enviada com sucesso!"
    );

    setMensagemSuporte("");
    setContatoSuporte("");
    setModalSuporte(false);

  } catch (error) {
    console.error(error);

    alert(
      "Erro ao enviar solicitação."
    );
    if (!contatoSuporte || !mensagemSuporte) {
  alert("Preencha o contato e a mensagem.");
  return;
}
  }
};
const alterarSenha = async () => {
  try {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(
      user.email,
      senhaAtual
    );

    await reauthenticateWithCredential(
      user,
      credential
    );

    await updatePassword(
      user,
      novaSenha
    );

    alert("Senha alterada com sucesso!");

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");

    setModalSeguranca(false);

  } catch (error) {
    console.error(error);

    if (error.code === "auth/wrong-password") {
      alert("Senha atual incorreta.");
    } else {
      alert("Erro ao alterar senha.");
    }
  }
};

async function carregarPerfil(uid) {
  const ref = doc(db, "usuarios", uid);

  const snap = await getDoc(ref);

  if (snap.exists()) {
    const dados = snap.data();

    setNomePerfil(dados.nomePerfil || "");
    setEmpresaPerfil(dados.empresaPerfil || "");
    setTelefonePerfil(dados.telefonePerfil || "");
    setFotoPerfil(dados.fotoPerfil || "");
  }
}
useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      setUsuario(user);
      if (user) {
  carregarPerfil(user.uid);
}
    }
    
  );
  return unsubscribe;
}, []);
const hora = new Date().getHours();

let saudacao = "Boa noite";

if (hora < 12) {
  saudacao = "Bom dia";
} else if (hora < 18) {
  saudacao = "Boa tarde";
}

  return (
    <div style={styles.container}>

      {/* TOP BAR */}
      <header style={styles.topbar}>
        <div style={styles.actions}>
<div style={styles.userArea}>
 <img
  src={fotoPerfil || logo}
  alt="Perfil"
  style={styles.logo}
/>

  <div style={styles.userInfo}>
    <h3 style={styles.userName}>
{saudacao}, {nomePerfil || usuario?.displayName || "Usuário"} 👋    </h3>

    <p style={styles.userSub}>
{empresaPerfil || "Bem-vindo ao Agendly"}    </p>
  </div>
</div>

<button
  style={styles.iconBtn2}
  onClick={() => {
    setAbaSidebar("notificacoes");
    setSidebarOpen(true);
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6683ceff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
{notificacoes.length > 0 && (
  <span style={styles.badge}>
    {notificacoes.length}
  </span>
  )}
</button>
          <button
  style={{
    ...styles.iconBtn,
    marginLeft: "auto",
  }}
  onClick={() => setSidebarOpen(true)}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
</button>

        </div>
      </header>

      {/* CONTENT */}
      <div style={styles.layout}>
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>

      {/* SIDEBAR */}
      <Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  aba={abaSidebar}
  setAba={setAbaSidebar}
  notificacoes={notificacoes}
  setNotificacoes={setNotificacoes}
  onLogout={() => console.log("logout")}
  onOpenPerfil={() => setModalPerfil(true)}
  onOpenSeguranca={() => setModalSeguranca(true)}
  onOpenPlanos={() => setModalPlanos(true)}
  onOpenSuporte={() => setModalSuporte(true)}
/>

      {/* PLANOS */}
      {modalPlanos && (
        <div style={styles.overlay} onClick={() => setModalPlanos(false)}>
          <div style={styles.planModal} onClick={(e) => e.stopPropagation()}>
 <button
              style={styles.closeX}
              onClick={() => setModalPlanos(false)}
            >
              ✕
            </button>

<h2> Planos</h2>
 <p>Escolha o plano ideal para seu negócio</p>

<small
  style={{
    color: "#6B7280",
    display: "block",
    marginBottom: 16,
  }}
>
  {planoAtual.descricao}
</small>           

            <div style={styles.planCard}>
              <h3>Free</h3>
              <ul>
            
  <li>✔ Agenda completa</li>
  <li>✔ Clientes ilimitados</li>
  <li>✔ Até 1 profissional</li>
  <li>✔ Faturamento </li>
  <li>✔ Quantidade de atendimentos</li>

              </ul>
              <button style={styles.btn}>Plano básico</button>
            </div>

            <div style={{ ...styles.planCard, border: "2px solid #4A6FFF" }}>
              <h3>Premium</h3>
             <ul>
  <li>✔ Tudo do plano Free</li>
  <li>✔ Profissionais ilimitados</li>
  <li>✔ Faturamento da equipe</li>
  <li>✔ Faturamento do negócio</li>
  <li>✔ Ranking da equipe</li>
  <li>✔ Remover anúncios</li>
              </ul>
            {planoAtual.tipo === "premium" ? (
  <button
    style={{
      ...styles.btn,
      cursor: "default",
      background: "#DCFCE7",
      color: "#15803D",
    }}
    disabled
  >
    ✅ Você já possui o Premium
  </button>
) : (
  <button
    style={styles.btnPrimary}
    onClick={() => iniciarCheckout("premium")}
  >
    Assinar Premium • R$ 19,90/mês
    <br />
  </button>
)}
            </div>

  
          </div>
        </div>
      )}


{modalPerfil && (
  <div
    style={styles.overlay}
    onClick={() => setModalPerfil(false)}
  >
    <div
      style={styles.planModal}
      onClick={(e) => e.stopPropagation()}
    >
      <h2> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#537fb9ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen-icon lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>  Editar perfil
 </h2>
   
    <input
  style={styles.input}
  placeholder="Seu nome"
  value={nomePerfil}
  onChange={(e) => setNomePerfil(e.target.value)}
/>

<input
  style={styles.input}
  placeholder="Nome da empresa"
  value={empresaPerfil}
  onChange={(e) => setEmpresaPerfil(e.target.value)}
/>

<input
  style={styles.input}
  placeholder="Telefone"
  value={telefonePerfil}
  onChange={(e) => setTelefonePerfil(e.target.value)}
/>

<label style={styles.uploadBtn}>
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const arquivo = e.target.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFotoPerfil(reader.result);
    };

    reader.readAsDataURL(arquivo);
  }}
/>
  </label>

<button
  style={styles.secondaryBtn}
onClick={() => {
  setFotoPerfil("");
}}
>
  ✨ Usar logo Agendly
</button>

<button
  style={styles.btnPrimary}
  onClick={async () => {

    await setDoc(
      doc(db, "usuarios", usuario.uid),
      {
        nomePerfil,
        empresaPerfil,
        telefonePerfil,
        fotoPerfil,
      },
      { merge: true }
    );

    alert("Perfil salvo!");
    setModalPerfil(false);
  }}
>
  Salvar
</button>

    <button
              style={styles.closeX}
              onClick={() => setModalPerfil(false)}
            >
              ✕
            </button>
    </div>
  </div>
)}

{modalSeguranca && (
  <div
    style={styles.overlay}
    onClick={() => setModalSeguranca(false)}
  >
    <div
      style={styles.planModal}
      onClick={(e) => e.stopPropagation()}
    >
      <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#609ce0ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-open-icon lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> Segurança</h2>

      <input
        type="password"
        placeholder="Senha atual"
        style={styles.input}
        value={senhaAtual}
        onChange={(e) =>
          setSenhaAtual(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Nova senha"
        style={styles.input}
        value={novaSenha}
        onChange={(e) =>
          setNovaSenha(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Confirmar nova senha"
        style={styles.input}
        value={confirmarSenha}
        onChange={(e) =>
          setConfirmarSenha(e.target.value)
        }
      />

      <button
        style={styles.btnPrimary}
        onClick={alterarSenha}
      >
        Alterar Senha
      </button>

  <button
              style={styles.closeX}
              onClick={() => setModalSeguranca(false)}
            >
              ✕
            </button>
    </div>
  </div>
)}


{modalSuporte && (
  <div
    style={styles.overlay}
    onClick={() => setModalSuporte(false)}
  >
    <div
      style={styles.planModal}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>🎧 Suporte</h2>

      <p
        style={{
          fontSize: 14,
          color: "#6B7280",
          marginBottom: 16,
        }}
      >
        Encontrou algum problema ou possui uma sugestão?
      </p>

<input
  value={contatoSuporte}
  onChange={(e) =>
    setContatoSuporte(e.target.value)
  }
  style={styles.input}
  placeholder="Seu WhatsApp ou e-mail para contato"
/>
      <textarea
  value={mensagemSuporte}
  onChange={(e) =>
    setMensagemSuporte(e.target.value)
  }
  style={{
    ...styles.input,
    minHeight: 120,
    resize: "none",
  }}
  placeholder="Descreva sua dúvida ou problema..."
/>

     <button
  style={styles.btnPrimary}
  onClick={enviarSuporte}
>
  Enviar Solicitação
</button>

      <button
              style={styles.closeX}
              onClick={() => setModalSuporte(false)}
            >
              ✕
            </button>
    </div>
  </div>
)}
      <BottomNav />
      <ModalNovoAtendimento />

    </div>
  );

  
}
const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    background: "#F4F7FF",
    overflow: "hidden",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px",
  },

 actions: {
  display: "flex",
  padding: "10px",
  width: "100%",
  justifyContent: "flex-end",
  gap: 10,
},

  iconBtn: {
  width: 42,
  height: 42,
  borderRadius: 12,
  border: "none",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  fontSize: 20,
  cursor: "pointer",
},

  iconBtn2: {
      position: "relative",
  width: 42,
  height: 42,
  marginLeft: 16,
  borderRadius: 12,
  border: "none",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  fontSize: 20,
  cursor: "pointer",
},

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#EF4444",
    color: "#fff",
    width: 18,
    height: 18,
    borderRadius: "50%",
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  layout: {
    display: "flex",
    height: "calc(100vh - 60px)",
  },

 content: {
  flex: 1,
  overflowY: "auto",
  padding: "0 16px 90px 16px",
  boxSizing: "border-box",
},

 overlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  zIndex: 2000,
},

  modal: {
    background: "#fff",
    margin: "auto",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
  },

  input: {
    width: "90%",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
  },

  button: {
    width: "100%",
    marginTop: 15,
    padding: 12,
    background: "#4A6FFF",
    color: "#fff",
    border: "none",
    borderRadius: 10,
  },

  plan: {
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 10,
    marginTop: 10,
  },

  planModal: {
  background: "#fff",
  margin: "auto",
  padding: 20,
  borderRadius: 16,
  width: "92%",
  maxWidth: 420,
  maxHeight: "85vh",
  overflowY: "auto",
},

planCard: {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
},

btnPrimary: {
  width: "100%",
  marginTop: 10,
  padding: 12,
  background: "#4A6FFF",
  color: "#fff",
  border: "none",
  borderRadius: 10,
},

btn: {
  width: "100%",
  marginTop: 10,
  padding: 12,
  background: "#eee",
  border: "none",
  borderRadius: 10,
},

 logo: {
  width: 50,
  height: 50,
  marginBottom: 0,
  borderRadius: 50,
},
userArea: {
  display: "flex",
  alignItems: "center",
  gap: 12,
},

userInfo: {
  display: "flex",
  flexDirection: "column",
},

userName: {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#111827",
},

userSub: {
  margin: 0,
  fontSize: 13,
  color: "#6B7280",
},
closeX: {
  position: "absolute",
  right: 15,
  top: 15,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 18,
},
profileHeader: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap:10,
  marginBottom: 24,
},

profileImage: {
  width: 100,
  height: 100,
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #4A6FFF",
  boxShadow: "0 10px 30px rgba(74,111,255,.25)",
  marginBottom: 12,
},

uploadBtn: {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "12px",
  borderRadius: 12,
  background: "#EEF2FF",
  color: "#4A6FFF",
  cursor: "pointer",
  fontWeight: 600,
  boxSizing: "border-box",
  marginTop: 10,
},

secondaryBtn: {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "12px",
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  background: "#fff",
  cursor: "pointer",
  boxSizing: "border-box",
  marginTop: 10,
},

modernInput: {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  marginBottom: 12,
  fontSize: 14,
  outline: "none",
},

saveProfileBtn: {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "none",
  background: "#4A6FFF",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(74,111,255,.3)",
},
modalHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
},

clearBtn: {
  border: "none",
  background: "#EEF2FF",
  color: "#4A6FFF",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
},

notificationCard: {
  background: "#F9FAFB",
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
},
badge: {
  position: "absolute",
  top: -5,
  right: -5,
  background: "#EF4444",
  color: "#fff",
  minWidth: 18,
  height: 18,
  borderRadius: "50%",
  fontSize: 11,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 5px",
},
currentPlan: {
    background: "#EEF2FF",
    border: "1px solid #C7D2FE",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
},

};

export default MainLayout;