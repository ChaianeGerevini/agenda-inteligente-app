import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../../contexts/UserContext";
import { auth, db } from "../../services/firebase";
import "./clientes.css";

function Clientes() {
const [clientes, setClientes] = useState([]);

  const [modalCliente, setModalCliente] = useState(false);
  const [modalPromo, setModalPromo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const [clienteEditando, setClienteEditando] = useState(null);
const { usuario } = useUser();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacao, setObservacao] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");

useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "clientes"),
    where("empresaId", "==", usuario.empresaId)
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setClientes(lista);
  });

  return () => unsub();
}, [usuario]);

const mensagemPadrao = `Oi, {nome}! Tudo bem? 😊

Passei para te avisar que estou com uma promoção especial e lembrei de você!

✨ Digite sua promoção aqui

Se quiser aproveitar, é só me chamar por aqui que será um prazer agendar um horário para você.

Espero te ver em breve! 💙`;

const [promo, setPromo] = useState(mensagemPadrao);


  // ➕ NOVO CLIENTE
async function salvarCliente() {
if (!nome || !telefone) return;

await addDoc(
  collection(db, "clientes"),
  {
    nome,
    telefone,
    empresaId: usuario.empresaId, // 👈 ISSO FALTAVA
    observacao,
    usuarioId: usuario.uid,
    createdAt: new Date(),
  }
);

setNome("");
setTelefone("");
setObservacao("");

setModalCliente(false);
  }

  // ✏️ ABRIR EDIÇÃO
  function abrirEdicao(cliente) {
    setClienteEditando(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setObservacao(cliente.observacao || "");
    setModalEditar(true);
  }

  // 💾 SALVAR EDIÇÃO
async function salvarEdicao() {
  
  await updateDoc(
  doc(db, "clientes", clienteEditando.id),
  {
    nome,
    telefone,
    observacao,
  }
);

setModalEditar(false);
setClienteEditando(null);

setNome("");
setTelefone("");
setObservacao("");
  }

  // ❌ EXCLUIR
async function excluirCliente(id) {

  await deleteDoc(
    doc(db, "clientes", id)
  );

}

  // 📲 PROMO WHATS
function enviarPromocao(cliente) {
  const mensagem = promo.replace("{nome}", cliente.nome);

  window.open(
    `https://wa.me/55${cliente.telefone}?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );
}

  return (
    <div className="clientes-page">

      {/* HEADER */}
      <div className="header">
        <h2>Clientes</h2>
      </div>

      {/* AÇÕES */}
      <div className="acoes">
        <button
          className="btn-primary"
          onClick={() => setModalCliente(true)}
        >
           Novo Cliente  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-plus-icon lucide-copy-plus"><line x1="15" x2="15" y1="12" y2="18"/><line x1="12" x2="18" y1="15" y2="15"/><rect width="13" height="13" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>

        <button
          className="btn-secondary"
          onClick={() => setModalPromo(true)}
        >
         Promoção  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-megaphone-icon lucide-megaphone"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/></svg>
        </button>
      </div>

      {/* LISTA */}
      <div className="clientes-lista">
        {clientes.map((cliente) => (
          <div className="cliente-card" key={cliente.id}>
            <div>
              <h4>{cliente.nome}</h4>
              <p>{cliente.telefone}</p>
              {cliente.observacao && (
  <small>{cliente.observacao}</small>
)}
            </div>

            <div className="acoes-card">
              <button
                className="editar"
                onClick={() => abrirEdicao(cliente)}
              >
                Editar
              </button>

              <button
                className="excluir"
                onClick={() =>
                  excluirCliente(cliente.id)
                }
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NOVO CLIENTE */}
      {modalCliente && (
        <div className="modal-bg">
          <div className="modal">

            <button
              className="fechar"
              onClick={() => setModalCliente(false)}
            >
              ✕
            </button>

            <h3>Novo Cliente</h3>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <textarea
  placeholder="Observações do cliente"
  value={observacao}
  onChange={(e) => setObservacao(e.target.value)}
/>

            <button
              className="btn-primary"
              onClick={salvarCliente}
            >
              Salvar Cliente
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDITAR CLIENTE */}
      {modalEditar && (
        <div className="modal-bg">
          <div className="modal">

            <button
              className="fechar"
              onClick={() => setModalEditar(false)}
            >
              ✕
            </button>

            <h3>Editar Cliente</h3>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <textarea
  placeholder="Observações"
  value={observacao}
  onChange={(e) => setObservacao(e.target.value)}
/>

            <button
              className="btn-primary"
              onClick={salvarEdicao}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {/* MODAL PROMOÇÃO */}
      {modalPromo && (
        <div className="modal-bg">
          <div className="modal">

            <button
              className="fechar"
              onClick={() => setModalPromo(false)}
            >
              ✕
            </button>

            <h3>Enviar Promoção</h3>

            <textarea
                rows={10}
                value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />

           <select
  className="cliente-select"
  value={clienteSelecionado}
  onChange={(e) => {
  const id = e.target.value;
  setClienteSelecionado(id);

  const cliente = clientes.find(c => c.id === id);

  if (cliente) {
    setPromo(
      mensagemPadrao.replace("{nome}", cliente.nome)
    );
  } else {
    setPromo(mensagemPadrao);
  }
}}
>
  <option value="">
    Selecione um cliente
  </option>

  {clientes.map((cliente) => (
    <option
      key={cliente.id}
      value={cliente.id}
    >
      {cliente.nome}
    </option>
  ))}
</select>

<button
  className="btn-whats"
  disabled={!clienteSelecionado}
  onClick={() => {

    const cliente = clientes.find(
      (c) =>
        String(c.id) === clienteSelecionado
    );

    if (!cliente) return;

    enviarPromocao(cliente);
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg> Enviar WhatsApp
</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;