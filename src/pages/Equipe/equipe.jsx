import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../services/firebase";

function Equipe() {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [membros, setMembros] = useState([]);

  // 🔥 listar equipe em tempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "equipe"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembros(lista);
    });

    return () => unsub();
  }, []);

  // ➕ adicionar membro
  async function adicionarMembro() {
    if (!nome) return;

    await addDoc(collection(db, "equipe"), {
      nome,
      cargo,
      createdAt: new Date(),
    });

    setNome("");
    setCargo("");
  }

  // ❌ remover membro
  async function remover(id) {
    await deleteDoc(doc(db, "equipe", id));
  }

  return (
    <div style={styles.container}>
      <h1>👥 Equipe</h1>

      {/* FORM */}
      <div style={styles.form}>
        <input
          placeholder="Nome do profissional"
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

        <button onClick={adicionarMembro} style={styles.button}>
          Adicionar membro
        </button>
      </div>

      {/* LISTA */}
      <h3>Membros da equipe</h3>

      {membros.length === 0 ? (
        <p>Nenhum membro cadastrado</p>
      ) : (
        membros.map((m) => (
          <div key={m.id} style={styles.card}>
            <div>
              <b>{m.nome}</b>
              <p>{m.cargo}</p>
            </div>

            <button onClick={() => remover(m.id)} style={styles.delete}>
              Remover
            </button>
          </div>
        ))
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

  form: {
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 16,
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

  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 8,
    marginBottom: 8,
    background: "#fff",
  },

  delete: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default Equipe;