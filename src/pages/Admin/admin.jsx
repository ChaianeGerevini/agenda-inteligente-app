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

  const premiumPlus = usuarios.filter(
    (u) => u.plano === "premium_plus"
  ).length;

  const receita =
    premium * 19.9 +
    premiumPlus * 39.9;

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
      <h1>Painel Administrativo</h1>

      <div style={styles.grid}>
        <Card
          titulo="Usuários"
          valor={usuarios.length}
        />

        <Card
          titulo="Clientes"
          valor={clientes.length}
        />

        <Card
          titulo="Agendamentos"
          valor={agendamentos.length}
        />

        <Card
          titulo="Profissionais"
          valor={equipe.length}
        />

        <Card titulo="Free" valor={free} />

        <Card
          titulo="Premium"
          valor={premium}
        />

        <Card
          titulo="Premium+"
          valor={premiumPlus}
        />

        <Card
          titulo="Receita"
          valor={`R$ ${receita.toFixed(2)}`}
        />

        <Card
          titulo="Chamados"
          valor={chamados.length}
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

function Card({ titulo, valor }) {
  return (
    <div style={styles.card}>
      <h3>{titulo}</h3>
      <h2>{valor}</h2>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(150px,1fr))",
    gap: 15,
    marginTop: 20,
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow:
      "0 4px 12px rgba(0,0,0,.08)",
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