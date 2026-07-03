import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../services/firebase";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [equipe, setEquipe] = useState([]);

  const [chamados, setChamados] = useState([]);
  const [chamadoSelecionado, setChamadoSelecionado] =
    useState(null);

  const [resposta, setResposta] = useState("");

  useEffect(() => {
    const unsubUsuarios = onSnapshot(
      collection(db, "usuarios"),
      (snapshot) => {
        setUsuarios(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    const unsubClientes = onSnapshot(
      collection(db, "clientes"),
      (snapshot) => {
        setClientes(snapshot.docs);
      }
    );

    const unsubChamados = onSnapshot(
      collection(db, "suporte"),
      (snapshot) => {
        setChamados(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    const unsubAgendamentos = onSnapshot(
      collection(db, "agendamentos"),
      (snapshot) => {
        setAgendamentos(snapshot.docs);
      }
    );

    const unsubEquipe = onSnapshot(
      collection(db, "equipe"),
      (snapshot) => {
        setEquipe(snapshot.docs);
      }
    );

    return () => {
      unsubUsuarios();
      unsubClientes();
      unsubChamados();
      unsubAgendamentos();
      unsubEquipe();
    };
  }, []);

  const free = usuarios.filter(
    (u) => u.plano === "free"
  ).length;

  const premium = usuarios.filter(
    (u) => u.plano === "premium"
  ).length;
const trial = usuarios.filter(
  (u) => u.statusAssinatura === "teste"
).length;

const ativos = usuarios.filter((u) => {
  if (!u.ultimoAcesso) return false;

  const ultimo =
    u.ultimoAcesso.toDate?.() ??
    new Date(u.ultimoAcesso);

  const limite = new Date();
  limite.setDate(limite.getDate() - 30);

  return ultimo >= limite;
}).length;

const indicacoes = usuarios.reduce(
  (total, usuario) =>
    total + (usuario.referralsCount || 0),
  0
);

const android = usuarios.filter(
  (u) => u.plataforma === "android"
).length;

const ios = usuarios.filter(
  (u) => u.plataforma === "ios"
).length;

// virá da Google Play futuramente
const downloads = usuarios.length;
 
  const receita =
    premium * 19.9;

  const responderChamado = async () => {
    if (!resposta.trim()) return;

    try {
      await updateDoc(
        doc(
          db,
          "suporte",
          chamadoSelecionado.id
        ),
        {
          resposta,
          status: "respondido",
          respondidoEm:
            new Date().toISOString(),
        }
      );

      alert("Resposta enviada!");

      setResposta("");
      setChamadoSelecionado(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao responder.");
    }
  };

  return (
    <div style={styles.container}>
<div style={styles.header}>
  <div>
    <h1 style={styles.titulo}>📊 Agenda Inteligente</h1>
    <p style={styles.subtitulo}>
      Painel Administrativo • Atualizado em tempo real
    </p>
  </div>

  <div style={styles.online}>
    <span style={styles.bolinha}></span>
    Sistema Online
  </div>
</div>
      <div style={styles.grid}>
  <Card
  icon="👥"
  titulo="Usuários"
  valor={usuarios.length}
  cor="#2563EB"
/>

<Card
  icon="📲"
  titulo="Downloads"
  valor={downloads}
  cor="#7C3AED"
/>

<Card
  icon="🟢"
  titulo="Ativos"
  valor={ativos}
  cor="#16A34A"
/>

<Card
  icon="⭐"
  titulo="Premium"
  valor={premium}
  cor="#EAB308"
/>

<Card
  icon="🧪"
  titulo="Trial"
  valor={trial}
  cor="#F97316"
/>

<Card
  icon="💰"
  titulo="Receita"
  valor={`R$ ${receita.toFixed(2)}`}
  cor="#059669"
/>

<Card
  icon="💬"
  titulo="Chamados"
  valor={chamados.length}
  cor="#DC2626"
/>

<Card
  icon="🎁"
  titulo="Indicações"
  valor={indicacoes}
  cor="#EC4899"
/>

      </div>

      <h2 style={{ marginTop: 40 }}>
        Chamados de Suporte
      </h2>

      <div style={styles.listaChamados}>
        {chamados.length === 0 ? (
          <p>Nenhum chamado aberto.</p>
        ) : (
          chamados.map((chamado) => (
            <div
              key={chamado.id}
              style={styles.chamadoCard}
            >
              <h3>
                {chamado.nome ||
                  chamado.usuario ||
                  "Usuário"}
              </h3>

              <p>
                <strong>Status:</strong>{" "}
                {chamado.status || "aberto"}
              </p>

              <div style={styles.mensagem}>
                {chamado.mensagem}
              </div>

              <button
                style={styles.btn}
                onClick={() => {
                  setChamadoSelecionado(
                    chamado
                  );
                  setResposta(
                    chamado.resposta || ""
                  );
                }}
              >
                Abrir Chamado
              </button>
            </div>
          ))
        )}
      </div>

      {chamadoSelecionado && (
        <div
          style={styles.overlay}
          onClick={() =>
            setChamadoSelecionado(null)
          }
        >
          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>Chamado</h2>

            <p>
              <strong>Usuário:</strong>{" "}
              {chamadoSelecionado.nome ||
                chamadoSelecionado.usuario}
            </p>

            <div style={styles.mensagem}>
              {chamadoSelecionado.mensagem}
            </div>

            <textarea
              style={styles.textarea}
              placeholder="Digite sua resposta..."
              value={resposta}
              onChange={(e) =>
                setResposta(e.target.value)
              }
            />

            <button
              style={styles.btn}
              onClick={responderChamado}
            >
              Enviar Resposta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ icon, titulo, valor, cor }) {
  return (
    <div
      style={{
        ...styles.card,
        borderTop: `5px solid ${cor}`,
      }}
    >
      <div style={{ fontSize: 34 }}>{icon}</div>

      <p
        style={{
          margin: "12px 0 6px",
          color: "#6B7280",
          fontWeight: 600,
        }}
      >
        {titulo}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize: 30,
          color: "#111827",
        }}
      >
        {valor}
      </h2>
    </div>
  );
}  


const styles = {
  container: {
    padding: 20,
  },
  header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 30,
  flexWrap: "wrap",
  gap: 20,
},

titulo: {
  margin: 0,
  fontSize: 32,
  fontWeight: 700,
  color: "#1F2937",
},

subtitulo: {
  marginTop: 8,
  color: "#6B7280",
  fontSize: 15,
},

online: {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#ECFDF5",
  color: "#16A34A",
  padding: "10px 16px",
  borderRadius: 30,
  fontWeight: 600,
},

bolinha: {
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#22C55E",
},

  grid: {
    display: "grid",
    gridTemplateColumns:
"repeat(auto-fit,minmax(150px,1fr))",
    gap: 15,
    marginTop: 20,
  },

  card: {
  background: "#FFFFFF",
  padding: 22,
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
  transition: ".25s",
  cursor: "default",
},

  listaChamados: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginTop: 20,
  },

  chamadoCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow:
      "0 4px 12px rgba(0,0,0,.08)",
  },

  mensagem: {
    background: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    whiteSpace: "pre-wrap",
  },

  btn: {
    marginTop: 15,
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 12,
    background: "#4A6FFF",
    color: "#fff",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    width: "90%",
    maxWidth: 600,
    background: "#fff",
    padding: 20,
    borderRadius: 20,
  },

  textarea: {
    width: "100%",
    minHeight: 140,
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
    resize: "none",
    boxSizing: "border-box",
  },
};

export default Admin;