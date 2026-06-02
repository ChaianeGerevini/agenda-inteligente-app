import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db, auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Clientes() {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const navigate = useNavigate();

  // 🔐 proteção da página
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/");
      } else {
        setUser(u);
      }
    });

    return () => unsubAuth();
  }, []);

  // 📦 buscar clientes em tempo real
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

  // ➕ adicionar cliente
  async function adicionarCliente() {
    if (!nome || !telefone) return;

    await addDoc(collection(db, "clientes"), {
      nome,
      telefone,
      createdAt: new Date(),
    });

    setNome("");
    setTelefone("");
  }

  // ❌ deletar cliente
  async function deletarCliente(id) {
    await deleteDoc(doc(db, "clientes", id));
  }

  return (
    <div style={styles.container}>
      <h1>Clientes</h1>

      <button onClick={() => navigate("/dashboard")}>
        Voltar
      </button>

      {/* FORM */}
      <div style={styles.form}>
        <input
          placeholder="Nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          style={styles.input}
        />

        <button onClick={adicionarCliente} style={styles.button}>
          Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div>
        {clientes.length === 0 ? (
          <p>Nenhum cliente cadastrado</p>
        ) : (
          clientes.map((c) => (
            <div key={c.id} style={styles.card}>
              <div>
                <b>{c.nome}</b>
                <p>{c.telefone}</p>
              </div>

              <button onClick={() => deletarCliente(c.id)}>
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
  },
  form: {
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 300,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 10,
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #ddd",
  },
};

export default Clientes;