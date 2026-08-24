import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";

import logo from "/src/assets/agendly-logo.jpg";

import { db } from "../../services/firebase";

import { useUser } from "../../contexts/UserContext";

function Onboarding() {
  const { usuario } = useUser();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState(1);

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [telefone, setTelefone] = useState("");

  // NOVO
  const [comoConheceu, setComoConheceu] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      if (!nome) setNome(usuario.nome || "");
      if (!empresa) setEmpresa(usuario.nome || "");
    }
  }, [usuario]);

  const segmentos = [
    {
      nome: "Salão de beleza",
      icone: "💇",
    },
    {
      nome: "Barbearia",
      icone: "💈",
    },
    {
      nome: "Clínica",
      icone: "🩺",
    },
    {
      nome: "Outro",
      icone: "✨",
    },
  ];

  // NOVO
  const origens = [
    {
      nome: "Google Play",
      icone: "📱",
    },
    {
      nome: "Instagram",
      icone: "📸",
    },
    {
      nome: "Threads",
      icone: "🧵",
    },
    {
      nome: "TikTok",
      icone: "🎵",
    },
    {
      nome: "Outro",
      icone: "✨",
    },
  ];

  async function finalizar() {
    if (!usuario?.uid) {
      alert("Usuário não encontrado.");
      return;
    }

    if (!nome.trim()) {
      alert("Digite seu nome.");
      return;
    }

    if (!empresa.trim()) {
      alert("Digite o nome da empresa.");
      return;
    }

    if (!comoConheceu) {
      alert("Selecione como você conheceu o Agendly.");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "usuarios", usuario.uid), {
        nome: nome.trim(),

        // Nome utilizado posteriormente para o proprietário
        nomePerfil: nome.trim(),

        empresaPerfil: empresa.trim(),

        categoria,

        telefonePerfil: telefone.trim(),

        // NOVO
        comoConheceu,

        onboardingCompleto: true,
      });

      navigate("/Faturamento");
    } catch (error) {
      console.error("Erro ao finalizar onboarding:", error);

      alert("Erro ao salvar configuração.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <img src={logo} style={styles.logo} alt="Agendly" />

        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progress,
              width: `${etapa * 33.3}%`,
            }}
          />
        </div>

        <p style={styles.step}>Etapa {etapa} de 3</p>

        <AnimatePresence mode="wait">
          {/* =========================
              ETAPA 1
          ========================= */}
          {etapa === 1 && (
            <motion.div
              key="step1"
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -50,
              }}
            >
              <h1>
                👋 Olá {usuario?.nome || "empreendedor"}
              </h1>

              <p style={styles.subtitle}>
                Vamos configurar seu Agendly
                <br />
                em poucos passos.
              </p>

              <button
                style={styles.button}
                onClick={() => setEtapa(2)}
              >
                Começar 🚀
              </button>
            </motion.div>
          )}

          {/* =========================
              ETAPA 2
          ========================= */}
          {etapa === 2 && (
            <motion.div
              key="step2"
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -50,
              }}
            >
              <h2>💼 Qual seu negócio?</h2>

              <div style={styles.grid}>
                {segmentos.map((item) => (
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    key={item.nome}
                    onClick={() => setCategoria(item.nome)}
                    style={{
                      ...styles.segmento,
                      border:
                        categoria === item.nome
                          ? "2px solid #4A6FFF"
                          : "1px solid rgba(255,255,255,.3)",
                    }}
                  >
                    <div style={styles.icon}>{item.icone}</div>

                    <p>{item.nome}</p>
                  </motion.div>
                ))}
              </div>

              <button
                style={{
                  ...styles.button,
                  opacity: categoria ? 1 : 0.5,
                }}
                disabled={!categoria}
                onClick={() => setEtapa(3)}
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* =========================
              ETAPA 3
          ========================= */}
          {etapa === 3 && (
            <motion.div
              key="step3"
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -50,
              }}
            >
              <h2>🏢 Seu negócio</h2>

              <input
                style={styles.input}
                value={nome}
                placeholder="Seu nome"
                onChange={(e) => setNome(e.target.value)}
              />

              <input
                style={styles.input}
                value={empresa}
                placeholder="Nome da empresa"
                onChange={(e) => setEmpresa(e.target.value)}
              />

              <input
                style={styles.input}
                value={telefone}
                placeholder="Telefone"
                onChange={(e) => setTelefone(e.target.value)}
              />

              {/* =========================
                  NOVO CAMPO
              ========================= */}

              <div style={styles.origemContainer}>
                <h3 style={styles.origemTitle}>
                  📣 Como você conheceu o Agendly?
                </h3>

                <div style={styles.origemGrid}>
                  {origens.map((item) => (
                    <motion.div
                      key={item.nome}
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() => setComoConheceu(item.nome)}
                      style={{
                        ...styles.origemCard,
                        border:
                          comoConheceu === item.nome
                            ? "2px solid #4A6FFF"
                            : "1px solid #e5e7eb",
                        background:
                          comoConheceu === item.nome
                            ? "#EEF2FF"
                            : "#fff",
                      }}
                    >
                      <span style={styles.origemIcon}>
                        {item.icone}
                      </span>

                      <span style={styles.origemNome}>
                        {item.nome}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                style={{
                  ...styles.button,
                  opacity:
                    nome.trim() &&
                    empresa.trim() &&
                    comoConheceu
                      ? 1
                      : 0.5,
                }}
                disabled={
                  loading ||
                  !nome.trim() ||
                  !empresa.trim() ||
                  !comoConheceu
                }
                onClick={finalizar}
              >
                {loading ? "Salvando..." : "Finalizar 🚀"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#eef2ff,#dbeafe)",
    padding: 20,
    overflow: "auto",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    padding: 35,
    borderRadius: 28,
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 25px 60px rgba(0,0,0,.15)",
    textAlign: "center",
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    marginBottom: 20,
  },

  progressContainer: {
    height: 8,
    background: "#e5e7eb",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
  },

  progress: {
    height: "100%",
    background: "#4A6FFF",
    transition: "width .4s",
  },

  step: {
    fontSize: 13,
    color: "#64748b",
  },

  subtitle: {
    color: "#64748b",
    lineHeight: 1.5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginTop: 25,
    marginBottom: 25,
  },

  segmento: {
    padding: 20,
    borderRadius: 20,
    background: "rgba(255,255,255,.7)",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },

  icon: {
    fontSize: 35,
  },

  input: {
    width: "100%",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
    border: "1px solid #ddd",
    fontSize: 15,
    boxSizing: "border-box",
  },

  // NOVO
  origemContainer: {
    marginTop: 20,
    textAlign: "left",
  },

  // NOVO
  origemTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 12,
  },

  // NOVO
  origemGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  // NOVO
  origemCard: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "all .2s",
  },

  // NOVO
  origemIcon: {
    fontSize: 20,
  },

  // NOVO
  origemNome: {
    fontSize: 13,
    color: "#334155",
    fontWeight: 500,
  },

  button: {
    width: "100%",
    padding: 15,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg,#4A6FFF,#2563eb)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 20,
  },
};

export default Onboarding;