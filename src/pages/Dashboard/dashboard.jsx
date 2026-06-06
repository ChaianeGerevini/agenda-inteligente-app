import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

import { auth, db } from "../../services/firebase";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [equipe, setEquipe] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  // 🔐 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
// Faturamento total da equipe no mês
const faturamentoMesEquipe = agendamentosMes.reduce(
  (total, a) => total + Number(a.valor || 0),
  0
);
  const faturamentoMes = agendamentosMes.reduce(
    (t, a) => t + (a.valor || 0),
    0
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Olá, seja bem-vindo! 👋
      </h2>
      <h3>Sobre sua empresa:</h3>

  
      {/* =========================
          📊 CARDS PREMIUM (COMPACTOS)
      ========================= */}

      
      <div style={styles.metricsGrid}>
        
        <div style={styles.card}>
          <span style={styles.cardIcon}>💸</span>
          <p style={styles.cardTitle}>Hoje</p>
          <h3 style={styles.cardValue}>
            R$ {faturamentoHoje.toFixed(2)}
          </h3>
        </div>

        <div style={styles.card}>
            <span style={styles.cardIcon}>📈</span>
          <p style={styles.cardTitle}>Mês</p>
          <h3 style={styles.cardValue}>
            R$ {faturamentoMes.toFixed(2)}
          </h3>
        </div>

        <div style={styles.card}>
          <span style={styles.cardIcon}>📅</span>
          <p style={styles.cardTitle}>Atendimentos hoje</p>
          <h3 style={styles.cardValue}>
            {agendamentosHoje.length}
          </h3>
        </div>

        <div style={styles.card}>
          <span style={styles.cardIcon}>💰</span>
          <p style={styles.cardTitle}> Faturamento da Equipe</p>
          <h3 style={styles.cardValue}>
            R$ {faturamentoMesEquipe.toFixed(2)}
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
    padding: 16,
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
    color: "#111827",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginBottom: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 16,

    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    minHeight: 120,

    transition: "all .2s ease",
    cursor: "pointer",
  },

  cardIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
    fontWeight: 500,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },

  section: {
    background: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    color: "#111827",
  },

  agendaItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 12,

    borderRadius: 12,

    background: "#fafafa",

    marginBottom: 8,
  },

  agendaSub: {
    fontSize: 12,
    color: "#6B7280",
  },

  valor: {
    fontWeight: 700,
    color: "#10B981",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  cardHeader: {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 8,
},

cardEmoji: {
  fontSize: 18,
},

cardTitle: {
  fontSize: 12,
  color: "#6B7280",
  fontWeight: 500,
  margin: 0,
},

cardValue: {
  fontSize: 22,
  fontWeight: 700,
  color: "#111827",
},
};

export default Dashboard;