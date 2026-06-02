import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../services/firebase";

function Agenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [mesAtual, setMesAtual] = useState(new Date());

  // modal
  const [open, setOpen] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [titulo, setTitulo] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");

  // 🔥 AGENDAMENTOS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "agendamentos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAgendamentos(lista);
    });

    return () => unsub();
  }, []);

  // 👤 CLIENTES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clientes"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClientes(lista);
    });

    return () => unsub();
  }, []);

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  const dias = Array.from({ length: diasNoMes }, (_, i) => {
    const dia = i + 1;

    const dataFormatada = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;

    return {
      dia,
      data: dataFormatada,
      eventos: agendamentos.filter((a) => a.data === dataFormatada),
    };
  });

  function mudarMes(delta) {
    const nova = new Date(ano, mes + delta, 1);
    setMesAtual(nova);
  }

  // 🟢 abrir modal
  function abrirModal(data) {
    setDataSelecionada(data);
    setTitulo("");
    setClienteSelecionado("");
    setOpen(true);
  }

  // 💾 salvar agendamento
  async function salvar() {
    if (!titulo || !clienteSelecionado) return;

    await addDoc(collection(db, "agendamentos"), {
      titulo,
      cliente: clienteSelecionado,
      data: dataSelecionada,
      createdAt: new Date(),
    });

    setOpen(false);
    setTitulo("");
    setClienteSelecionado("");
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => mudarMes(-1)}>◀</button>

        <h2>
          {mesAtual.toLocaleString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button onClick={() => mudarMes(1)}>▶</button>
      </div>

      {/* CALENDÁRIO */}
      <div style={styles.grid}>
        {dias.map((d) => (
          <div
            key={d.data}
            style={styles.day}
            onClick={() => abrirModal(d.data)}
          >
            <div style={styles.dayNumber}>{d.dia}</div>

            {d.eventos.map((ev) => (
              <div key={ev.id} style={styles.event}>
                <b>{ev.titulo}</b>
                <div style={styles.client}>{ev.cliente}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div style={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>📅 Novo agendamento</h3>
            <p>{dataSelecionada}</p>

            {/* SERVIÇO */}
            <input
              placeholder="Serviço (ex: corte, unha...)"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={styles.input}
            />

            {/* CLIENTE */}
            <select
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              style={styles.input}
            >
              <option value="">Selecione o cliente</option>

              {clientes.map((c) => (
                <option key={c.id} value={c.nome}>
                  {c.nome}
                </option>
              ))}
            </select>

            <button onClick={salvar} style={styles.button}>
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    paddingBottom: 90,
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 8,
  },

  day: {
    minHeight: 90,
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 6,
    background: "#fff",
    cursor: "pointer",
  },

  dayNumber: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  event: {
    background: "#4A6FFF",
    color: "#fff",
    padding: "3px 4px",
    borderRadius: 4,
    fontSize: 10,
    marginBottom: 2,
    overflow: "hidden",
  },

  client: {
    fontSize: 9,
    opacity: 0.9,
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 320,
  },

  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: 12,
    background: "#4A6FFF",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default Agenda;