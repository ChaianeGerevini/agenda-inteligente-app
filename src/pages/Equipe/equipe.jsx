import { useEffect, useState } from "react";
import {
collection,
addDoc,
onSnapshot,
deleteDoc,
doc,
updateDoc,
query,
where,
} from "firebase/firestore";

import { db } from "../../services/firebase";
import PremiumGate from "../../components/PremiumGate";
import RoleGate from "../../components/RoleGate";
import { useUser } from "../../contexts/UserContext";
import UpgradeCard from "../../components/UpgradeCard";

function Equipe() {
const { usuario, hasAccess, isPremium } = useUser();

  const [modalPerfil, setModalPerfil] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [comissao, setComissao] = useState(""); // % do SALÃO
  const [membros, setMembros] = useState([]);
  const [cor, setCor] = useState("#4A6FFF");
  const [status, setStatus] = useState("ativo");

  const [modalPlanos, setModalPlanos] = useState(false);

const requirePremium = (callback) => {
  if (!isPremium()) {
    setModalPlanos(true);
    return;
  }
  callback?.();
};

  function abrirPerfil(profissional) {
    setProfissionalSelecionado(profissional);
    setModalPerfil(true);
  }

useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "equipe"),
    where("empresaId", "==", usuario.empresaId)
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      
      id: doc.id,
      ...doc.data(),
    }));

    setMembros(lista);
  });

  return () => unsub();
}, [usuario]);

  async function adicionarMembro() {
  if (!nome) return;

  const podeAdicionar = isPremium() || membros.length < 1;

if (!podeAdicionar) {
  setModalPlanos(true);
  return;
}

async function adicionarMembro() {
  if (!nome) return;

  if (!podeAdicionarEquipe()) {
    setModalPlanos(true);
    return;
  }

  await addDoc(collection(db, "equipe"), {
    nome,
    cargo,
    telefone,
    comissao: Number(comissao || 0),
    cor,
    status,
    empresaId: usuario.empresaId,
    gestorId: usuario.uid,
    createdAt: new Date(),
  });

  setNome("");
  setCargo("");
  setTelefone("");
  setComissao("");
  setCor("#4A6FFF");
  setStatus("ativo");
}
}
  async function remover(id) {
    await deleteDoc(doc(db, "equipe", id));
  }

async function gerarConvite(profissional) {

  const codigo = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();


 await addDoc(collection(db, "convites"), {

  codigo,
  empresaId: usuario.empresaId,
  gestorId: usuario.uid,

  profissionalId: profissional.id,

  usado: false,
  createdAt: new Date()

});


  return codigo;
}

async function enviarConvite(profissional) {

const codigo = await gerarConvite(profissional);

const link =
  `https://bqsh6c.mimo.run/index.html?convite=${codigo}`;

  const mensagem =
`Olá ${profissional.nome}! 👋

Você foi convidado para fazer parte da equipe no Agendly.

Cadastre-se pelo link:

${link}`;

  if (navigator.share) {

    try {

      await navigator.share({
        title: "Convite Agendly",
        text: mensagem,
        url: link
      });

      return;

    } catch {}

  }

  window.open(
    `https://wa.me/55${profissional.telefone}?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );
}

  async function salvarPerfil() {
    if (!profissionalSelecionado) return;

    await updateDoc(doc(db, "equipe", profissionalSelecionado.id), {
      nome: profissionalSelecionado.nome,
      cargo: profissionalSelecionado.cargo,
      telefone: profissionalSelecionado.telefone,
      comissao: Number(profissionalSelecionado.comissao || 0),
      cor: profissionalSelecionado.cor,
      status: profissionalSelecionado.status,
    });

    setModalPerfil(false);
  }

  return (
            <RoleGate permitido={["gestor"]}>
    <div style={styles.container}>
      <h1 style={styles.title}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65a9e5ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg> Equipe</h1>

      <div style={styles.form}>
        <input
          placeholder="Nome do colaborador"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Cargo (ex: barbeiro, manicure...)"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Comissão do salão %"
          value={comissao}
          onChange={(e) => setComissao(e.target.value)}
          style={styles.input}
        />

        <input
          type="color"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          style={{
            width: "90%",
            height: 50,
            marginBottom: 10,
            border: "none",
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.input}
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        <button onClick={adicionarMembro} style={styles.button}>
          + Adicionar profissional
        </button>
      </div>

      <h3 style={styles.subtitle}>Profissionais</h3>

      

      {membros.length === 0 ? (
        <p style={{ color: "#666" }}>Nenhum profissional cadastrado</p>
      ) : (
        
        membros.map((m, index) => (
          
          <div
  key={m.id}
  style={{
    ...styles.card,
    position: "relative",
    overflow: "hidden",
    filter: !isPremium() && index >= 1 ? "blur(2px)" : "none",
    opacity: !isPremium() && index >= 1 ? 0.6 : 1,
    pointerEvents: !isPremium() && index >= 1 ? "none" : "auto",
  }}
>
            <div>
              <div style={styles.headerCard}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: m.cor || "#4A6FFF",
                  }}
                />
                <div style={styles.name}>{m.nome}</div>
              </div>

              <div style={styles.info}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65a9e5ff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-id-card-lanyard-icon lucide-id-card-lanyard"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/></svg> {m.cargo || "-"}</div>
              <div style={styles.info}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65a9e5ff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg> {m.telefone || "-"}</div>

              {/* 🔥 aqui está a lógica correta */}
              <div style={styles.info}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65a9e5ff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-icon lucide-building"><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/><path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg> Salão recebe: {m.comissao || 0}%
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontWeight: 600,
                  color: m.status === "ativo" ? "#16A34A" : "#DC2626",
                }}
              >
                {m.status === "ativo" ? "🟢 Ativo" : "🔴 Inativo"}
              </div>
            </div>

            <div style={styles.cardButtons}>
              <button
                style={styles.profileButton}
                onClick={() => abrirPerfil(m)}
              >
                Perfil
              </button>

              <button
                style={styles.inviteButton}
                onClick={() => enviarConvite(m)}
              >
                Convidar
              </button>

              <button
                onClick={() => remover(m.id)}
                style={styles.delete}
              >
                Remover
              </button>
            </div>
            {!isPremium() && index >= 1 && (
  <div style={styles.premiumOverlay}>
    <div style={styles.premiumBox}>
      <div style={styles.premiumTitle}>🔒 Limite atingido</div>

      <div style={styles.premiumText}>
        No plano gratuito você pode ter apenas 1 profissional.
      </div>

      <button
        style={styles.premiumButton}
        onClick={() => setModalPlanos(true)}
      >
        Fazer upgrade
      </button>
    </div>
  </div>
)}
          </div>

        ))
      )}

      {modalPerfil && profissionalSelecionado && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeX}
              onClick={() => setModalPerfil(false)}
            >
              ✕
            </button>

            <h2>{profissionalSelecionado.nome}</h2>

            <input
              value={profissionalSelecionado.nome}
              onChange={(e) =>
                setProfissionalSelecionado({
                  ...profissionalSelecionado,
                  nome: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              value={profissionalSelecionado.cargo}
              onChange={(e) =>
                setProfissionalSelecionado({
                  ...profissionalSelecionado,
                  cargo: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              value={profissionalSelecionado.telefone}
              onChange={(e) =>
                setProfissionalSelecionado({
                  ...profissionalSelecionado,
                  telefone: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              value={profissionalSelecionado.comissao}
              onChange={(e) =>
                setProfissionalSelecionado({
                  ...profissionalSelecionado,
                  comissao: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              type="color"
              value={profissionalSelecionado.cor}
              onChange={(e) =>
                setProfissionalSelecionado({
                  ...profissionalSelecionado,
                  cor: e.target.value,
                })
              }
              style={{
                width: "100%",
                height: 50,
                marginTop: 10,
                border: "none",
              }}
            />

            <select
              value={profissionalSelecionado.status}
              onChange={(e) =>
                setProfissionalSelecionado({
                  ...profissionalSelecionado,
                  status: e.target.value,
                })
              }
              style={styles.input}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <button style={styles.button} onClick={salvarPerfil}>
              Salvar Alterações
            </button>
          </div>
        </div>
            )}

      {modalPlanos && (
        <UpgradeCard onClose={() => setModalPlanos(false)} />
      )}
    </div>
    </RoleGate>
  );
}

const styles = {
  container: {
    padding: 20,
    paddingBottom: 90,
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "arial",
  },

  title: {
    fontSize: 28,
    fontWeight: 400,
    marginBottom: 16,
  },

  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 600,
  },

  form: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,.05)",
    marginBottom: 20,
  },

  input: {
    width: "90%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    outline: "none",
  },

  button: {
    width: "90%",
    padding: 12,
    background: "#4A6FFF",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    background: "#fff",
    marginBottom: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },

  name: {
    fontWeight: 700,
    marginBottom: 4,
  },

  info: {
    fontSize: 12,
    color: "#0c0c0cff",
  },

  comissao: {
    fontSize: 12,
    color: "#10b981af",
    marginTop: 4,
    fontWeight: 600,
  },

  delete: {
    background: "#df5656d0",
    color: "#fff",
    border: "none",
    padding: "8px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
  },
  
  headerCard: {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
},

cardButtons: {
  display: "flex",
  flexDirection: "column",
  gap: 6,
},

profileButton: {
  border: "none",
  padding: 8,
  borderRadius: 8,
  background: "#EEF2FF",
  cursor: "pointer",
},

inviteButton: {
  border: "none",
  padding: 8,
  borderRadius: 8,
  background: "#DCFCE7",
  cursor: "pointer",
},
overlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

modal: {
  width: "90%",
  maxWidth: 400,
  background: "#FFF",
  borderRadius: 20,
  padding: 20,
  gap: 8,
  position: "relative",
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
premiumOverlay: {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(2px)",
},

premiumBox: {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  textAlign: "center",
  width: "85%",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
},

premiumTitle: {
  fontWeight: 700,
  marginBottom: 6,
  fontSize: 14,
},

premiumText: {
  fontSize: 12,
  color: "#666",
  marginBottom: 12,
},

premiumButton: {
  background: "#4A6FFF",
  color: "#fff",
  border: "none",
  padding: 10,
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  width: "100%",
},
};

export default Equipe;