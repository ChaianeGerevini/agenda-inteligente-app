import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

function Indique() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Carregando...</p>;
  }

  if (!userData) {
    return <p style={styles.loading}>Usuário não encontrado</p>;
  }

const link = `${window.location.origin}/i/${userData.referralCode}`;

  const progress = Math.min(
    ((userData.referralsCount || 0) / 5) * 100,
    100
  );

  const compartilhar = async () => {

  const texto =
`Estou usando o Agendly para organizar meus agendamentos.

Cadastre-se pelo meu link:

${link}`;

if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {

    try {

      await navigator.share({
        title: "Agendly",
        text: texto,
        url: link
      });

    } catch (e) {}

  } else {

    navigator.clipboard.writeText(link);

    alert("Link copiado!");

  }

};
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎁 Indique e Ganhe</h1>
        <p style={styles.subtitle}>
          Compartilhe o Agendly e ganhe 1 mês Premium a cada 5 amigos
        </p>

        {/* LINK */}
        <div style={styles.box}>
          <p style={styles.label}>Seu link de indicação</p>

          <div style={styles.linkBox}>
            <input value={link} readOnly style={styles.input} />

<button
  style={{
    ...styles.button,
    background: "#EEF2FF",
    color: "#4A6FFF"
  }}
  onClick={() => {
    navigator.clipboard.writeText(link);
    alert("Link copiado!");
  }}
>
  Copiar
</button>
          </div>
        </div>

        {/* PROGRESSO */}
        <div style={styles.box}>
          <p style={styles.label}>Seu progresso</p>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>

          <p style={styles.progressText}>
            {userData.referralsCount || 0} de 5 indicações
          </p>
        </div>

        {/* BENEFÍCIOS */}
        <div style={styles.box}>
          <p style={styles.label}>Recompensa</p>

          <div style={styles.reward}>
            🎉 5 amigos = 1 mês Premium grátis
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #EEF2FF, #F8FAFF)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Arial",
  },

  card: {
    width: "100%",
    maxWidth: 500,
    background: "#fff",
    borderRadius: 16,
    padding: 25,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },

  box: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    background: "#F9FAFB",
    border: "1px solid #EEF2FF",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },

  linkBox: {
    display: "flex",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    fontSize: 13,
    background: "#fff",
  },

  button: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  progressBar: {
    width: "100%",
    height: 10,
    background: "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4A6FFF, #6D8CFF)",
    borderRadius: 20,
    transition: "0.3s",
  },

  progressText: {
    marginTop: 8,
    fontSize: 13,
    color: "#374151",
  },

  reward: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6FFF",
  },

  loading: {
    textAlign: "center",
    marginTop: 50,
    color: "#6b7280",
  },
};
export default Indique;