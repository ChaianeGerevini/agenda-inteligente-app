import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

import { auth, db } from "../../services/firebase";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  // 🔐 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 👥 CLIENTES
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clientes"), (snapshot) => {
      setClientes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // 📅 AGENDAMENTOS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "agendamentos"), (snapshot) => {
      setAgendamentos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // 📊 MÉTRICAS
  // =========================

  const hoje = new Date().toISOString().split("T")[0];

  const agendamentosHoje = agendamentos.filter((a) => a.data === hoje);

  const faturamentoHoje = agendamentosHoje.reduce(
    (t, a) => t + (a.valor || 0),
    0
  );

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const agendamentosMes = agendamentos.filter((a) => {
    const data = new Date(a.data);
    return (
      data.getMonth() === mesAtual &&
      data.getFullYear() === anoAtual
    );
  });

  const faturamentoMes = agendamentosMes.reduce(
    (t, a) => t + (a.valor || 0),
    0
  );

  const ticketMedio =
    agendamentosMes.length > 0
      ? faturamentoMes / agendamentosMes.length
      : 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>

      {/* =========================
          📊 CARDS PREMIUM (COMPACTOS)
      ========================= */}
      <div style={styles.metricsGrid}>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Hoje</p>
          <h3 style={styles.cardValue}>
            R$ {faturamentoHoje.toFixed(2)}
          </h3>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Mês</p>
          <h3 style={styles.cardValue}>
            R$ {faturamentoMes.toFixed(2)}
          </h3>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Atendimentos</p>
          <h3 style={styles.cardValue}>
            {agendamentosHoje.length}
          </h3>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Clientes</p>
          <h3 style={styles.cardValue}>
            {clientes.length}
          </h3>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Ticket Médio</p>
          <h3 style={styles.cardValue}>
            R$ {ticketMedio.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* =========================
          📅 AGENDA DO DIA
      ========================= */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 Hoje</h3>

        {agendamentosHoje.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: 13 }}>
            Nenhum agendamento hoje
          </p>
        ) : (
          agendamentosHoje
            .sort((a, b) => (a.hora > b.hora ? 1 : -1))
            .map((a) => (
              <div key={a.id} style={styles.agendaItem}>
                <div>
                  <b>{a.nomeCliente || "Cliente"}</b>
                  <p style={styles.agendaSub}>
                    {a.hora} • {a.servico || "Serviço"}
                  </p>
                </div>

                <span style={styles.valor}>
                  R$ {a.valor || 0}
                </span>
              </div>
            ))
        )}
      </div>

      {/* =========================
          👤 USER (SÓ INFO)
      ========================= */}
      {user && (
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {user.email}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 14,
    fontFamily: "Arial",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  title: {
    marginBottom: 10,
  },

  // 📊 GRID COMPACTO
metricsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)", // 🔥 3 por linha (mais compacto)
  gap: 8,
  marginBottom: 12,
},

  // 🟦 CARD PREMIUM PEQUENO
card: {
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",

  padding: 30,

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  textAlign: "center",

  minHeight: 70, // 🔥 mantém compacto
},

  cardTitle: {
    fontSize: 11,
    color: "#777",
    marginBottom: 4,
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },

  // 📅 AGENDA
  section: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },

  sectionTitle: {
    marginBottom: 8,
  },

  agendaItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 8,
    borderBottom: "1px solid #eee",
  },

  agendaSub: {
    fontSize: 12,
    opacity: 0.6,
  },

  valor: {
    fontWeight: "bold",
    color: "#4CAF50",
  },

  footer: {
    marginTop: 15,
    textAlign: "center",
  },

  footerText: {
    fontSize: 11,
    opacity: 0.5,
  },
};

export default Dashboard;