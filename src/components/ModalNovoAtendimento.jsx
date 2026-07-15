import { useState, useEffect } from "react";
import { useRef } from "react";
import { query, where, getDocs } from "firebase/firestore";
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { useUser } from "../contexts/UserContext";

import { db } from "../services/firebase";
import { useUi } from "../contexts/UiContext";

function ModalNovoAtendimento() {
  const {
    modalNovoAgendamento,
    setModalNovoAgendamento,
  } = useUi();

  const hoje = new Date().toISOString().split("T")[0];
const [agendamentos, setAgendamentos] = useState([]);
const [telefone, setTelefone] = useState("");
  const [titulo, setTitulo] = useState("");
  const [cliente, setCliente] = useState("");
  const [valor, setValor] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
const [horaFim, setHoraFim] = useState("");
const [clientes, setClientes] = useState([]);
const [equipe, setEquipe] = useState([]);
const [profissional, setProfissional] = useState("");
const [showSugestoes, setShowSugestoes] = useState(false);
const modalRef = useRef(null);
const [inputAtivo, setInputAtivo] = useState(false);
const { usuario } = useUser();
const [bloquearFechamento, setBloquearFechamento] = useState(false);
const profissionalSelecionado = equipe.find(
  (p) => p.nome === profissional
);

const [data, setData] = useState(hoje);

useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "clientes"),
    where("empresaId", "==", usuario.empresaId)
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setClientes(lista);
  });

  return () => unsub();
}, [usuario]);

useEffect(() => {

  const unsub = onSnapshot(
    collection(db, "clientes"),
    (snapshot) => {

      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setClientes(lista);

    }
  );

  return () => unsub();

}, []);
useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "equipe"),
    where("empresaId", "==", usuario.empresaId),
    where("status", "==", "ativo")
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setEquipe(lista);
  });

  return () => unsub();
}, [usuario]);

const clientesFiltrados =
  cliente.length > 0
    ? clientes.filter((c) =>
        c.nome
          ?.toLowerCase()
          .includes(cliente.toLowerCase())
      )
    : [];
  if (!modalNovoAgendamento) return null;

async function criarClienteRapido() {

  try {

    await addDoc(collection(db, "clientes"), {
  nome: cliente.trim(),
  telefone: telefone.trim(),
  observacao: "",
  createdAt: new Date(),
  empresaId: usuario.empresaId, // 🔥 ESSENCIAL
  usuarioId: usuario.uid,
});

    setCliente(cliente.trim());

    alert("Cliente criado com sucesso!");

  } catch (error) {

    console.error(error);

  }

}
async function verificarConflitoRealtime(novo) {
  const q = query(
    collection(db, "agendamentos"),
    where("data", "==", novo.data),
    where("profissional", "==", novo.profissional)
  );

  const snapshot = await getDocs(q);

  const conflitos = snapshot.docs.some((doc) => {
    const a = doc.data();

    const inicioA = a.horaInicio;
    const fimA = a.horaFim;

    const inicioB = novo.horaInicio;
    const fimB = novo.horaFim;

    return (
      (inicioB >= inicioA && inicioB < fimA) ||
      (fimB > inicioA && fimB <= fimA) ||
      (inicioB <= inicioA && fimB >= fimA)
    );
  });

  return conflitos;
}
function temConflito(novo) {
  return agendamentos?.some((a) => {
    if (a.data !== novo.data) return false;
    if (a.profissional !== novo.profissional) return false;

    const inicioA = a.horaInicio;
    const fimA = a.horaFim;

    const inicioB = novo.horaInicio;
    const fimB = novo.horaFim;

    return (
      (inicioB >= inicioA && inicioB < fimA) ||
      (fimB > inicioA && fimB <= fimA) ||
      (inicioB <= inicioA && fimB >= fimA)
    );
  });
}
  async function salvar() {
    if (
  !titulo ||
  !cliente ||
  !horaInicio ||
  !horaFim
) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const novoAgendamento = {
  data,
  horaInicio,
  horaFim,
  profissional,
  titulo,
  cliente,
};

const conflito = await verificarConflitoRealtime(novoAgendamento);

if (conflito) {
  alert("⛔ Já existe um agendamento nesse horário para esse profissional.");
  return;
}
await addDoc(collection(db, "agendamentos"), {
  titulo,
  cliente,
  telefone,
  data,
  horaInicio,
  horaFim,
  profissional,

  empresaId: usuario.empresaId,
  gestorId: usuario.uid,

  corProfissional:
    profissionalSelecionado?.cor,

  valor: Number(valor || 0),

  status: "agendado",

  createdAt: new Date(),
});

await addDoc(collection(db, "notificacoes"), {
  empresaId: usuario.empresaId,

  tipo: "agendamento",

  titulo: "Novo atendimento",

  mensagem: `${cliente} marcou ${titulo} com ${profissional} às ${horaInicio}`,

  lida: false,

  createdAt: new Date(),
});
      setTitulo("");
      setCliente("");
      setTelefone("");
      setValor("");
      setHoraInicio("");
      setHoraFim("");
      setProfissional("");
      setData(hoje);

      setModalNovoAgendamento(false);

      alert("Atendimento criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar atendimento.");
    }
  }

 return (
  <div
  style={styles.overlay}
  onPointerDown={(e) => {
    if (bloquearFechamento) return;

    if (
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      setModalNovoAgendamento(false);
      setShowSugestoes(false);
    }
  }}
>
    <div
      ref={modalRef}
      style={styles.modal}
      onMouseDown={(e) => e.stopPropagation()}
    >
        <button
  style={styles.closeIcon}
  onClick={() => setModalNovoAgendamento(false)}
>
  ✕
</button>
        <h2 style={styles.title}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d88d8ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg> Novo Atendimento
        </h2>

        <input
          style={styles.input}
          placeholder="Serviço"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

 <div style={styles.autocomplete}>

<input
  style={styles.input}
  placeholder="Buscar Cliente"
  value={cliente}
  onChange={(e) => {
    setCliente(e.target.value);
      setTelefone("");
    setShowSugestoes(true);
  }}
  onFocus={() => setShowSugestoes(true)}
/>

  {showSugestoes &&
  cliente.length > 0 &&
  clientesFiltrados.length > 0 && (

      <div style={styles.sugestoes}>

        {clientesFiltrados.map((c) => (

          <div
            key={c.id}
            style={styles.sugestao}
            onClick={() => {
  setCliente(c.nome);
      setTelefone(c.telefone || "");
  setShowSugestoes(false);
  
  requestAnimationFrame(() => {
  document.activeElement?.blur?.();
});
            }}
            
            onMouseDown={(e) => e.preventDefault()}
          >
            {c.nome}
            
          </div>
          
        

        ))}

      </div>
    )}
      {cliente.length > 0 &&
 clientesFiltrados.length === 0 && (

  <div style={styles.sugestoes}>

    <div
      style={styles.sugestao}
      onClick={criarClienteRapido}
    >
      ➕ Criar cliente "{cliente}"
    </div>

    <input
  style={styles.input}
  placeholder="Telefone (opcional)"
  value={telefone}
  onChange={(e) => setTelefone(e.target.value)}
/>

  </div>

)}


</div>

<input
  type="date"
  style={styles.input}
  value={data}
  onFocus={() => setBloquearFechamento(true)}
  onBlur={() => {
    setTimeout(() => setBloquearFechamento(false), 150);
  }}
  onChange={(e) => setData(e.target.value)}
/>


<label style={styles.label}>Hora inicio</label>

        <input
      
  type="time"
  style={styles.input}
  value={horaInicio}
  onChange={(e) =>
    setHoraInicio(e.target.value)
  }
/>

<label style={styles.label}>Hora fim</label>
<input
  type="time"
  style={styles.input}
  value={horaFim}
  onChange={(e) =>
    setHoraFim(e.target.value)
  }
/>

       <select
  style={styles.select}
  value={profissional}
  onChange={(e) =>
    setProfissional(e.target.value)
  }
>
  <option value="">
    Profissional Responsável
  </option>

{equipe.map((membro) => (

  <option
    key={membro.id}
    value={membro.nome}
  >
    {membro.nome}
  </option>

))}
</select>

        <input
inputMode="decimal"        
  style={styles.input}
placeholder="Valor do Atendimento"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
<textarea
  style={{
    ...styles.input,
    minHeight: 90,
    resize: "none",
  }}
/>

        <button
          style={styles.saveButton}
          onClick={salvar}
        >
          Salvar Atendimento
        </button>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    background: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    margin: 10,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    position: "relative"
  },

  title: {
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 14,
    marginBottom: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxSizing: "border-box",
  },

  saveButton: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 12,
    background: "#4A6FFF",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 10,
  },

  closeButton: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 12,
    background: "#e5e7eb",
    marginTop: 10,
    cursor: "pointer",
  },

sugestoes: {
  position: "absolute",
  top: 60,
  left: 0,
  right: 0,

  background: "#fff",

  borderRadius: 12,

  boxShadow:
    "0 10px 25px rgba(0,0,0,.08)",

  zIndex: 999,

  maxHeight: 180,

  overflowY: "auto",
},

sugestao: {
  padding: "12px 14px",
  cursor: "pointer",
  borderBottom: "1px solid #f3f4f6",
  fontSize: 14,
},
sugestaoHover: {
  background: "#F5F7FB",
},
select: {
  width: "100%",
  padding: 14,
  marginBottom: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  boxSizing: "border-box",
  background: "#fff",
  fontSize: 14,
},
label: {
  display: "block",
  marginBottom: 6,
  marginTop: 8,
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
},
closeIcon: {
  position: "absolute",
  top: 15,
  right: 15,

  width: 34,
  height: 34,

  border: "none",
  borderRadius: "50%",

  background: "#f1f2f5ff",

  fontSize: 18,
  fontWeight: 700,

  cursor: "pointer",
},
};

export default ModalNovoAtendimento;