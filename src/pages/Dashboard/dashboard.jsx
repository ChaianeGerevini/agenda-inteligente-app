import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../../contexts/UserContext";


import { auth, db } from "../../services/firebase";

function Dashboard() {
  const [modalPlanos, setModalPlanos] = useState(false);
  const [equipe, setEquipe] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
 
const { usuario, isPremium } = useUser();

const premium = !!isPremium;

const requirePremium = (callback) => {
  if (!premium) {
    setModalPlanos(true);
    return;
  }
  callback?.();
};


  // 📅 AGENDAMENTOS
useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "agendamentos"),
    where("empresaId", "==", usuario.empresaId)
  );

  const unsub = onSnapshot(q, (snap) => {
    setAgendamentos(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });

  return () => unsub();
}, [usuario]);

  // 👥 EQUIPE
useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "equipe"),
    where("empresaId", "==", usuario.empresaId)
  );

  const unsub = onSnapshot(q, (snap) => {
    setEquipe(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });

  return () => unsub();
}, [usuario]);

  // =========================
  // 📅 FILTRO MÊS ATUAL
  // =========================

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const concluidos = agendamentos.filter((a) => a.status === "concluido");

  const agendamentosMes = concluidos.filter((a) => {
    const data = new Date(a.data);
    return (
      data.getMonth() === mesAtual &&
      data.getFullYear() === anoAtual
    );
  });

  // =========================
  // 💰 FATURAMENTO REAL (SISTEMA SALÃO)
  // =========================

  const faturamentoBruto = agendamentosMes.reduce(
    (t, a) => t + Number(a.valor || 0),
    0
  );

const faturamentoSalao = agendamentosMes.reduce((total, agendamento) => {
  const profissional = equipe.find(
    (p) => p.nome === agendamento.profissional
  );

  const percentualSalao = Number(profissional?.comissao || 0);

  return (
    total +
    (Number(agendamento.valor || 0) * percentualSalao) / 100
  );
}, 0);

const faturamentoProfissionais =
  faturamentoBruto - faturamentoSalao;

  // =========================
  // 👥 RANKING REAL
  // =========================

  const ranking = equipe.map((prof) => {
    const atendimentos = agendamentosMes.filter(
      (a) =>
        a.profissional === prof.nome ||
        a.profissionalId === prof.id
    );

    const totalBruto = atendimentos.reduce(
      (t, a) => t + Number(a.valor || 0),
      0
    );

 const ganhoSalao = atendimentos.reduce((total, a) => {
  return (
    total +
    (Number(a.valor || 0) *
      Number(prof.comissao || 0)) /
      100
  );
}, 0);

const ganhoProfissional =
  totalBruto - ganhoSalao;

    return {
      ...prof,
      qtd: atendimentos.length,
      totalBruto,
      ganhoProfissional,
      ganhoSalao,
    };
  });

  const rankingOrdenado = [...ranking].sort(
    (a, b) => b.totalBruto - a.totalBruto
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Olá 👋</h2>

      {/* =========================
          📊 CARDS
      ========================= */}
      <div style={styles.metricsGrid}>

        <div style={styles.card}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#39a6e6ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/></svg>
          <p style={styles.cardTitle}>Faturamento Bruto</p>
          <h3>R$ {faturamentoBruto.toFixed(2)}</h3>
        </div>
<div
  style={{
    ...styles.card,
    cursor: "pointer",
    opacity: premium ? 1 : 0.5,
  }}
  onClick={() => requirePremium(() => {
  console.log("abrir detalhe premium");
})}
>          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#39a6e6ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column-icon lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          <p style={styles.cardTitle}>Faturamento do negócio</p>
          <h3>R$ {faturamentoSalao.toFixed(2)}</h3>
        </div>
        
<div
  style={{
    ...styles.card,
    cursor: "pointer",
    opacity: premium ? 1 : 0.5,
  }}
 onClick={() => requirePremium(() => {
  console.log("abrir detalhe premium");
})}
>          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#39a6e6ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>
          <p style={styles.cardTitle}>Profissionais</p>
          <h3>R$ {faturamentoProfissionais.toFixed(2)}</h3>
        </div> 
                

        <div style={styles.card}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#39a6e6ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-sync-icon lucide-calendar-sync"><path d="M11 10v4h4"/><path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5"/><path d="M16 2v4"/><path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5"/><path d="M21 22v-4h-4"/><path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3"/><path d="M3 10h4"/><path d="M8 2v4"/></svg>
          <p style={styles.cardTitle}>Atendimentos</p>
          <h3>{agendamentosMes.length}</h3>
        </div>
      </div>

      {/* =========================
          👥 RANKING
      ========================= */}

<div
  style={{
    ...styles.card,
    cursor: "pointer",
    opacity: premium ? 1 : 0.5,
  }}
  onClick={() => requirePremium(() => {
  console.log("abrir detalhe premium");
})}
>
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39a6e6ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg> Ranking da Equipe</h3>

        {rankingOrdenado.map((p) => (
          <div key={p.id} style={styles.item}>
            <div>
              <strong>{p.nome}</strong>

              <div style={styles.sub}>
                {p.qtd} atendimentos
              </div>
            </div>

            <div style={styles.valor}>
              R$ {p.totalBruto.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
              
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================

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
    minHeight: 100,
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
};

export default Dashboard;