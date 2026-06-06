import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../services/firebase";

function Agenda() {
  const [mostrarDia, setMostrarDia] = useState(false);
  const [agendaDia, setAgendaDia] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [mesAtual, setMesAtual] = useState(new Date());
  const [visualizacao, setVisualizacao] = useState("mes");
  // modal
  const [open, setOpen] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [titulo, setTitulo] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [valor, setValor] = useState("");
  const [hora, setHora] = useState("");
  const [editandoId, setEditandoId] = useState(null);

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

/*Array From - nao mexer*/ 

const dias = Array.from({ length: diasNoMes }, (_, i) => {
  const dia = i + 1;

  const dataFormatada = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
    dia
  ).padStart(2, "0")}`;

  return {
    dia,
    data: dataFormatada,
    eventos: agendamentos
      .filter((a) => a.data === dataFormatada)
      .sort((a, b) =>
        (a.hora || "").localeCompare(b.hora || "")
      ),
  };
}); 
    /*Array From*/ 


const eventosDia = agendamentos
  .filter((a) => a.data === agendaDia)
  .sort((a, b) =>
    (a.hora || "").localeCompare(b.hora || "")
  );
  function mudarMes(delta) {
    const nova = new Date(ano, mes + delta, 1);
    setMesAtual(nova);
  }

  // 🟢 abrir modal
  function abrirModal(data) {
    setEditandoId(null);
    setDataSelecionada(data);
    setTitulo("");
    setClienteSelecionado("");
    setValor("");
    setHora("");
    setOpen(true);
    
  }
function editarAgendamento(evento) {
  setEditandoId(evento.id);

  setDataSelecionada(evento.data);
  setTitulo(evento.titulo || "");
  setClienteSelecionado(evento.cliente || "");
  setValor(evento.valor || "");
  setHora(evento.hora || "");

  setOpen(true);
}
async function salvarEdicao() {
  if (!editandoId) return;
const conflito = agendamentos.some(
  (a) =>
    a.id !== editandoId &&
    a.data === dataSelecionada &&
    a.hora === hora
);

if (conflito) {
  alert("Já existe um atendimento neste horário.");
  return;
}
await updateDoc(doc(db, "agendamentos", editandoId), {
  titulo,
  cliente: clienteSelecionado,
  data: dataSelecionada,
  hora,
  valor: Number(valor),
});

  setEditandoId(null);

  setTitulo("");
  setClienteSelecionado("");
  setValor("");
  setOpen(false);
}
async function excluirAgendamento() {
  if (!editandoId) return;

  const confirmar = window.confirm(
    "Deseja realmente excluir este agendamento?"
  );

  if (!confirmar) return;

  await deleteDoc(doc(db, "agendamentos", editandoId));

  setEditandoId(null);
  setTitulo("");
  setClienteSelecionado("");
  setValor("");
  setOpen(false);
}

  // 💾 salvar agendamento
  async function salvar() {
    if (!titulo || !clienteSelecionado) return;
  const horarioOcupado = agendamentos.some(
  (a) =>
    a.data === dataSelecionada &&
    a.hora === hora
);

if (horarioOcupado) {
  alert("Já existe um atendimento neste horário.");
  return;
}
 await addDoc(collection(db, "agendamentos"), {
  titulo,
  cliente: clienteSelecionado,
  data: dataSelecionada,
  hora,
  valor: Number(valor),
  createdAt: new Date(),
});

    setOpen(false);
    setTitulo("");
    setClienteSelecionado("");
  }

return (
  <div style={styles.container}>
<div style={styles.header}>
  <button
    style={styles.monthButton}
    onClick={() => mudarMes(-1)}
  >
    ◀
  </button>

  <h2>
    {mesAtual.toLocaleString("pt-BR", {
      month: "long",
      year: "numeric",
    })}
  </h2>

  <button
    style={styles.monthButton}
    onClick={() => mudarMes(1)}
  >
    ▶
  </button>
</div>
    <div style={styles.viewSelector}>
  <button
    style={{
      ...styles.viewButton,
      ...(visualizacao === "mes"
        ? styles.viewButtonActive
        : {}),
    }}
    onClick={() => setVisualizacao("mes")}
  >
    Mês
  </button>

  <button
    style={{
      ...styles.viewButton,
      ...(visualizacao === "semana"
        ? styles.viewButtonActive
        : {}),
    }}
    onClick={() => setVisualizacao("semana")}
  >
    Semana
  </button>

  <button
    style={{
      ...styles.viewButton,
      ...(visualizacao === "dia"
        ? styles.viewButtonActive
        : {}),
    }}
    onClick={() => setVisualizacao("dia")}
  >
    Dia
  </button>
</div>
      {/* CALENDÁRIO */}
     <div style={styles.grid}>
  {(visualizacao === "mes"
    ? dias
    : visualizacao === "semana"
    ? dias.filter((_, i) => {
        const hoje = new Date().getDate();
        return (
          i + 1 >= hoje &&
          i + 1 < hoje + 7
        );
      })
    : dias.filter(
        (d) =>
          d.dia === new Date().getDate()
      )
  ).map((d) => (
          <div
            key={d.data}
            style={styles.day}
            onClick={() => {
  setAgendaDia(d.data);
  setMostrarDia(true);
}}
          >
            <div style={styles.dayNumber}>{d.dia}</div>

            {d.eventos.map((ev) => (
  <div
  key={ev.id}
  style={styles.event}
  onClick={(e) => {
    e.stopPropagation();
    editarAgendamento(ev);
  }}
>
<div style={{ fontWeight: 700 }}>
  💇 {ev.titulo}
</div>

<div style={styles.client}>
  👤 {ev.cliente}
</div>

<div style={styles.client}>
  🕒 {ev.hora}
</div>

<div style={styles.client}>
  💰 R$ {ev.valor || 0}
</div>
  </div>
))}
          </div>
          
        ))}
      </div>

      {/* MODAL */}
    {mostrarDia && (
  <div
    style={styles.modalOverlay}
    onClick={() => setMostrarDia(false)}
  >
    <div
      style={styles.modal}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>📅 Agenda do Dia</h3>

      <p>{agendaDia}</p>

      {eventosDia.length === 0 && (
        <p>Nenhum atendimento.</p>
      )}

      {eventosDia.map((ev) => (
        <div
          key={ev.id}
          style={styles.eventCard}
          onClick={() => editarAgendamento(ev)}
        >
          <strong>🕒 {ev.hora}</strong>

          <div>👤 {ev.cliente}</div>

          <div>💇 {ev.titulo}</div>

          <div>💰 R$ {ev.valor}</div>
        </div>
      ))}

      <button
        style={styles.fabDay}
        onClick={() => {
          setMostrarDia(false);
          abrirModal(agendaDia);
        }}
      >
        +
      </button>
    </div>
  </div>
)}
      {open && (
        <div style={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>
  {editandoId
    ? "✏️ Editar Agendamento"
    : "📅 Novo Agendamento"}
</h3>
            <p>{dataSelecionada}</p>

            {/* SERVIÇO */}
            <input
              placeholder="Serviço (ex: corte, unha...)"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={styles.input}
            />
            <input
  type="number"
  placeholder="Valor do serviço"
  value={valor}
  onChange={(e) => setValor(e.target.value)}
  style={styles.input}
/>
<input
  type="time"
  value={hora}
  onChange={(e) => setHora(e.target.value)}
  style={styles.input}
/>
            {/* CLIENTE */}
         <input
  type="text"
  placeholder="Nome do cliente"
  value={clienteSelecionado}
  onChange={(e) => setClienteSelecionado(e.target.value)}
  style={styles.input}
/>


           <button
  onClick={editandoId ? salvarEdicao : salvar}
  style={styles.button}
>
  {editandoId ? "Salvar Alterações" : "Salvar"}
</button>
{editandoId && (
  <button
    onClick={excluirAgendamento}
    style={{
      ...styles.button,
      marginTop: 10,
      background: "#d32f2f",
    }}
  >
    Excluir Agendamento
  </button>
)}
          </div>
        </div>
      )}

      <button
  style={styles.fab}
  onClick={() => {
    const hoje = new Date()
      .toISOString()
      .split("T")[0];

    abrirModal(hoje);
  }}
>
  +
</button>
    </div>
  );
}

const styles = {
  container: {
    padding: 16,
    paddingBottom: 100,
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
  },

  // HEADER
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    background: "#fff",
    padding: "12px 16px",
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,.05)",
  },

  monthButton: {
    border: "none",
    background: "#eef2ff",
    color: "#4A6FFF",
    width: 40,
    height: 40,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
  },

  // BOTÕES MÊS / SEMANA / DIA
  viewSelector: {
    display: "flex",
    background: "#fff",
    padding: 5,
    borderRadius: 14,
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,.05)",
  },

  viewButton: {
    flex: 1,
    border: "none",
    padding: 12,
    borderRadius: 10,
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
    color: "#666",
    transition: ".2s",
  },

  viewButtonActive: {
    background: "#4A6FFF",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(74,111,255,.3)",
  },

grid: {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 8,

},

  day: {
    minHeight: 100,
    background: "#fff",
    borderRadius: 16,
    padding: 8,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
    transition: ".2s",
  },

  dayNumber: {
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
    marginBottom: 6,
  },

  // EVENTO
  event: {
    background: "#EEF2FF",
    borderLeft: "4px solid #4A6FFF",
    color: "#111827",
    padding: 6,
    borderRadius: 8,
    marginBottom: 4,
    fontSize: 11,
  },

  client: {
    fontSize: 10,
    color: "#666",
  },

  // MODAL
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    background: "#fff",
    width: "90%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
  },

  input: {
    width: "100%",
    padding: 14,
    marginTop: 8,
    marginBottom: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 14,
    background: "#4A6FFF",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 10,
  },

  deleteButton: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 14,
    background: "#EF4444",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 10,
  },

  // BOTÃO FLUTUANTE
  fab: {
    position: "fixed",
    padding: 10,
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    fontSize: 30,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(74,111,255,.4)",
    zIndex: 1000,
  },
  eventCard: {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
  cursor: "pointer",
},

fabDay: {
  width: 60,
  height: 60,
  borderRadius: "50%",
  border: "none",
  background: "#4A6FFF",
  color: "#fff",
  fontSize: 28,
  marginTop: 20,
  cursor: "pointer",
},
};

export default Agenda;