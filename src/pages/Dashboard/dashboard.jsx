import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "../../services/firebase";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  // 🔐 Verifica usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 📦 Buscar clientes em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clientes"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClientes(lista);
    });

    return () => unsubscribe();
  }, []);

  // ➕ Adicionar cliente
  const handleAddCliente = async () => {
    if (!nome || !telefone) return;

    await addDoc(collection(db, "clientes"), {
      nome,
      telefone,
      createdAt: new Date(),
    });

    setNome("");
    setTelefone("");
  };

  // ❌ Deletar cliente
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "clientes", id));
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {user && (
        <div style={styles.userBox}>
          <p>Logado como: <b>{user.email}</b></p>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Sair
          </button>
          <button
    onClick={() => navigate("/clientes")}
    style={{
      marginTop: 10,
      padding: 8,
      background: "#2196F3",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
    }}
  >
    Ir para Clientes
  </button>
        </div>
      )}

      {/* ➕ Cadastro de clientes */}
      <div style={styles.formBox}>
        <h2>Adicionar Cliente</h2>

        <input
          placeholder="Nome"
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

        <button onClick={handleAddCliente} style={styles.addButton}>
          Salvar Cliente
        </button>
      </div>

      {/* 📋 Lista de clientes */}
      <div style={styles.listBox}>
        <h2>Clientes</h2>

        {clientes.length === 0 ? (
          <p>Nenhum cliente cadastrado</p>
        ) : (
          clientes.map((c) => (
            <div key={c.id} style={styles.card}>
              <div>
                <b>{c.nome}</b>
                <p>{c.telefone}</p>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
                style={styles.deleteButton}
              >
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
    background: "#f5f7fb",
    minHeight: "100vh",
  },
  title: {
    marginBottom: 20,
  },
  userBox: {
    marginBottom: 20,
    padding: 10,
    background: "#fff",
    borderRadius: 8,
  },
  logoutButton: {
    padding: 8,
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  formBox: {
    padding: 15,
    background: "#fff",
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    display: "block",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  addButton: {
    padding: 10,
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  listBox: {
    padding: 15,
    background: "#fff",
    borderRadius: 8,
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #eee",
  },
  deleteButton: {
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default Dashboard;