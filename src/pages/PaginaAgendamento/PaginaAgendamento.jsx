import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";
import PersonalizarPagina from "./PersonalizarPagina";

function PaginaAgendamento() {
  const navigate = useNavigate();
  const { usuario } = useUser();

  const isPremium = usuario?.plano === "premium";
  const [loading, setLoading] = useState(false);

  // Se o usuário já possui uma página, vai direto para personalização
  if (usuario?.paginaAgendamento) {
    return <PersonalizarPagina />;
  }

  // ==============================
  // CHECKOUT
  // ==============================

  const iniciarCompra = async (tipo) => {
    if (!usuario?.uid || !usuario?.email) {
      alert("Não foi possível identificar seu usuário.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://backend-agenda-hgrd.onrender.com/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plano: tipo,
            userId: usuario.uid,
            email: usuario.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erro ao criar checkout."
        );
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(
        "Stripe não retornou uma URL de checkout."
      );
    } catch (error) {
      console.error("Erro ao iniciar compra:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const comprarAutonomo = () => {
    iniciarCompra("paginaAutonomo");
  };

  const comprarEquipe = () => {
    iniciarCompra("paginaEquipe");
  };

  return (
<div className="agendly-vitrine" style={styles.page}>
      {/* =========================================
          HEADER
      ========================================= */}

      <header style={styles.header}>

        <button
          style={styles.backButton}
          onClick={() => navigate("/")}
        >
          ←
        </button>

        <div style={styles.headerText}>
          <span style={styles.headerLabel}>
            AGENDLY
          </span>

          <h1 style={styles.title}>
            Sua agenda merece
            <span style={styles.titleHighlight}>
              {" "}uma vitrine profissional.
            </span>
          </h1>

          <p style={styles.subtitle}>
            Crie uma página personalizada para seus
            clientes conhecerem seus serviços e
            agendarem horários em poucos segundos.
          </p>
        </div>

      </header>


      {/* =========================================
          PREVIEW DA PÁGINA
      ========================================= */}

      <section style={styles.previewSection}>

        <div style={styles.previewText}>

          <span style={styles.previewBadge}>
            ✨ SUA MARCA ONLINE
          </span>

          <h2 style={styles.previewTitle}>
            Pare de mandar mensagem
            para marcar horário.
          </h2>

          <p style={styles.previewDescription}>
            Tenha um link exclusivo para colocar
            no Instagram, WhatsApp, TikTok ou
            onde seus clientes estiverem.
          </p>

          <div style={styles.previewBenefits}>

            <div style={styles.previewBenefit}>
              <span style={styles.checkIcon}>✓</span>
              Seu nome e sua marca
            </div>

            <div style={styles.previewBenefit}>
              <span style={styles.checkIcon}>✓</span>
              Seus serviços
            </div>

            <div style={styles.previewBenefit}>
              <span style={styles.checkIcon}>✓</span>
              Seus horários disponíveis
            </div>

            <div style={styles.previewBenefit}>
              <span style={styles.checkIcon}>✓</span>
              Agendamento online
            </div>

          </div>

        </div>


        {/* MOCKUP CELULAR */}

        <div style={styles.phoneArea}>

          <div style={styles.phone}>

            <div style={styles.phoneTop}>
              <div style={styles.camera}></div>
            </div>

            <div style={styles.phoneScreen}>

              <div style={styles.mockHeader}>

                <div style={styles.mockAvatar}>
                  ✨
                </div>

                <h3 style={styles.mockName}>
                  Seu negócio
                </h3>

                <p style={styles.mockDescription}>
                  Agende seu horário
                  de forma rápida e fácil.
                </p>

              </div>


              <div style={styles.mockButton}>
                Agendar horário
              </div>


              <div style={styles.mockServices}>

                <div style={styles.mockService}>
                  <span>💅</span>
                  <div>
                    <strong>Manicure</strong>
                    <small>R$ 40,00</small>
                  </div>
                </div>

                <div style={styles.mockService}>
                  <span>✨</span>
                  <div>
                    <strong>Alongamento</strong>
                    <small>R$ 120,00</small>
                  </div>
                </div>

                <div style={styles.mockService}>
                  <span>💆</span>
                  <div>
                    <strong>Design</strong>
                    <small>R$ 50,00</small>
                  </div>
                </div>

              </div>

            </div>

            <div style={styles.phoneBottom}></div>

          </div>

        </div>

      </section>


      {/* =========================================
          COMO FUNCIONA
      ========================================= */}

      <section style={styles.stepsSection}>

        <div style={styles.sectionHeader}>

          <span style={styles.sectionLabel}>
            SIMPLES E RÁPIDO
          </span>

          <h2 style={styles.sectionTitle}>
            Coloque sua página no ar
            em poucos passos
          </h2>

          <p style={styles.sectionDescription}>
            Você não precisa entender de tecnologia.
            O Agendly faz tudo de forma simples.
          </p>

        </div>


        <div style={styles.steps}>

          <div style={styles.step}>

            <div style={styles.stepNumber}>
              1
            </div>

            <div>
              <h3 style={styles.stepTitle}>
                Escolha sua página
              </h3>

              <p style={styles.stepText}>
                Escolha o modelo ideal para
                seu negócio.
              </p>
            </div>

          </div>


          <div style={styles.step}>

            <div style={styles.stepNumber}>
              2
            </div>

            <div>
              <h3 style={styles.stepTitle}>
                Personalize
              </h3>

              <p style={styles.stepText}>
                Adicione seu nome, logo,
                serviços e suas cores.
              </p>
            </div>

          </div>


          <div style={styles.step}>

            <div style={styles.stepNumber}>
              3
            </div>

            <div>
              <h3 style={styles.stepTitle}>
                Compartilhe
              </h3>

              <p style={styles.stepText}>
                Copie seu link e coloque
                no Instagram ou WhatsApp.
              </p>
            </div>

          </div>


          <div style={styles.step}>

            <div style={styles.stepNumber}>
              4
            </div>

            <div>
              <h3 style={styles.stepTitle}>
                Receba agendamentos
              </h3>

              <p style={styles.stepText}>
                Seus clientes escolhem
                o horário disponível.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          PLANOS
      ========================================= */}

      <section style={styles.plansSection}>

        <div style={styles.sectionHeader}>

          <span style={styles.sectionLabel}>
            ESCOLHA SEU MODELO
          </span>

          <h2 style={styles.sectionTitle}>
            Uma página feita para
            o seu tipo de negócio
          </h2>

          <p style={styles.sectionDescription}>
            Pagamento único. Sem mensalidade pela página.
          </p>

        </div>


        <div style={styles.plansContainer}>

          {/* =====================================
              AUTÔNOMO
          ===================================== */}

          <div style={styles.card}>

            <div style={styles.cardTop}>

              <span style={styles.badge}>
                AUTÔNOMO
              </span>

              <div style={styles.cardIcon}>
                👤
              </div>

            </div>


            <h2 style={styles.planTitle}>
              Página individual
            </h2>

            <p style={styles.planDescription}>
              Ideal para profissionais que
              trabalham sozinhos.
            </p>


            <div style={styles.priceContainer}>

              <span style={styles.currency}>
                R$
              </span>

              <span style={styles.price}>
                29,90
              </span>

              <span style={styles.paymentType}>
                pagamento único
              </span>

            </div>


            <div style={styles.features}>

              <div style={styles.feature}>
                <span>✓</span>
                Página personalizada
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Logo da sua marca
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Cor personalizada
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Cadastro de serviços
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Link exclusivo
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Agendamento online
              </div>

            </div>


            <button
              style={styles.primaryButton}
              onClick={comprarAutonomo}
              disabled={loading}
            >
              {loading
                ? "Abrindo checkout..."
                : "Criar minha página"}
            </button>

          </div>


          {/* =====================================
              EQUIPE
          ===================================== */}

          <div
            style={{
              ...styles.card,
              ...styles.teamCard,
            }}
          >

            <div style={styles.recommended}>
              MAIS COMPLETO
            </div>


            <div style={styles.cardTop}>

              <span style={styles.badgeTeam}>
                EQUIPE
              </span>

              <div style={styles.cardIconTeam}>
                👥
              </div>

            </div>


            <h2 style={styles.planTitle}>
              Página para equipe
            </h2>

            <p style={styles.planDescription}>
              Para negócios que possuem
              vários profissionais.
            </p>


            <div style={styles.priceContainer}>

              <span style={styles.currency}>
                R$
              </span>

              <span style={styles.price}>
                59,90
              </span>

              <span style={styles.paymentType}>
                pagamento único
              </span>

            </div>


            <div style={styles.features}>

              <div style={styles.feature}>
                <span>✓</span>
                Tudo do Autônomo
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Vários profissionais
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Cliente escolhe o profissional
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Agenda por profissional
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Link exclusivo
              </div>

              <div style={styles.feature}>
                <span>✓</span>
                Agendamento online
              </div>

            </div>


            {!isPremium && (
              <div style={styles.premiumMessage}>

                <span>
                  🔒
                </span>

                <p>
                  O plano Equipe está disponível
                  apenas para usuários Premium.
                </p>

              </div>
            )}


            <button
              style={
                isPremium
                  ? styles.teamButton
                  : styles.lockedButton
              }
              onClick={
                isPremium
                  ? comprarEquipe
                  : () => navigate("/faturamento")
              }
              disabled={loading}
            >
              {isPremium
                ? loading
                  ? "Abrindo checkout..."
                  : "Criar página para equipe"
                : "🔒 Desbloquear com Premium"}
            </button>

          </div>

        </div>

      </section>


      {/* =========================================
          BENEFÍCIOS
      ========================================= */}

      <section style={styles.benefitsSection}>

        <div style={styles.benefitsHeader}>

          <span style={styles.sectionLabel}>
            MAIS PROFISSIONAL
          </span>

          <h2 style={styles.sectionTitle}>
            Transforme seu link em
            uma porta de entrada para seu negócio
          </h2>

        </div>


        <div style={styles.benefitsGrid}>

          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>
              📱
            </div>

            <h3>
              Feita para celular
            </h3>

            <p>
              Seus clientes conseguem
              agendar diretamente pelo
              celular.
            </p>
          </div>


          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>
              🎨
            </div>

            <h3>
              Sua identidade
            </h3>

            <p>
              Use seu nome, sua logo
              e suas cores.
            </p>
          </div>


          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>
              ⚡
            </div>

            <h3>
              Mais praticidade
            </h3>

            <p>
              Diminua as mensagens e
              facilite seus agendamentos.
            </p>
          </div>


          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>
              🔗
            </div>

            <h3>
              Link exclusivo
            </h3>

            <p>
              Compartilhe seu link
              onde quiser.
            </p>
          </div>

        </div>

      </section>


      {/* =========================================
          CTA FINAL
      ========================================= */}

      <section style={styles.finalCta}>

        <div style={styles.finalCtaContent}>

          <span style={styles.finalIcon}>
            ✨
          </span>

          <h2 style={styles.finalTitle}>
            Pronto para ter sua
            própria página?
          </h2>

          <p style={styles.finalText}>
            Escolha seu modelo e comece a receber
            agendamentos de forma mais profissional.
          </p>

          <button
            style={styles.finalButton}
            onClick={() => {
              document
                .getElementById("planos")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Quero minha página
          </button>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer style={styles.footer}>

        <strong>
          Agendly
        </strong>

        <span>
          Sua agenda. Seu negócio. Seu link.
        </span>

      </footer>

    </div>
  );
}


const styles = {

  // ==========================================
  // PÁGINA
  // ==========================================

  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(180deg, #f8faff 0%, #ffffff 45%, #f8fafc 100%)",
    paddingBottom: 40,
    boxSizing: "border-box",
    overflowX: "hidden",
  },


  // ==========================================
  // HEADER
  // ==========================================

  header: {
    width: "100%",
    maxWidth: 1000,
    margin: "0 auto",
    padding: "24px 20px 10px",
    boxSizing: "border-box",
    position: "relative",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    fontSize: 20,
    cursor: "pointer",
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  headerText: {
    maxWidth: 700,
  },

  headerLabel: {
    display: "inline-block",
    color: "#4A6FFF",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  title: {
    margin: 0,
    fontSize: 36,
    lineHeight: 1.15,
    fontWeight: 800,
    color: "#111827",
    letterSpacing: -1,
  },

  titleHighlight: {
    color: "#4A6FFF",
  },

  subtitle: {
    margin: "14px 0 0",
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: 620,
  },


  // ==========================================
  // PREVIEW
  // ==========================================

  previewSection: {
    maxWidth: 1000,
    margin: "40px auto 0",
    padding: "0 20px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 40,
  },

  previewText: {
    flex: 1,
    maxWidth: 520,
  },

  previewBadge: {
    display: "inline-block",
    padding: "7px 11px",
    borderRadius: 20,
    background: "#EEF2FF",
    color: "#4A6FFF",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 0.7,
  },

  previewTitle: {
    margin: "15px 0 10px",
    fontSize: 28,
    lineHeight: 1.2,
    color: "#111827",
  },

  previewDescription: {
    margin: 0,
    color: "#6B7280",
    lineHeight: 1.6,
    fontSize: 15,
  },

  previewBenefits: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 11,
  },

  previewBenefit: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontSize: 14,
    color: "#374151",
    fontWeight: 600,
  },

  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#DCFCE7",
    color: "#16A34A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },


  // ==========================================
  // CELULAR MOCKUP
  // ==========================================

  phoneArea: {
    width: 280,
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
  },

  phone: {
    width: 220,
    height: 430,
    background: "#111827",
    borderRadius: 34,
    padding: 8,
    boxShadow:
      "0 25px 60px rgba(37,64,140,0.22)",
    transform: "rotate(2deg)",
  },

  phoneTop: {
    height: 22,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  camera: {
    width: 65,
    height: 15,
    borderRadius: 20,
    background: "#000",
  },

  phoneScreen: {
    background: "#F8FAFC",
    height: "calc(100% - 38px)",
    borderRadius: 27,
    overflow: "hidden",
    padding: 14,
    boxSizing: "border-box",
  },

  mockHeader: {
    textAlign: "center",
    paddingTop: 10,
  },

  mockAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 8px",
    fontSize: 20,
  },

  mockName: {
    margin: 0,
    color: "#111827",
    fontSize: 15,
  },

  mockDescription: {
    margin: "5px auto 14px",
    color: "#6B7280",
    fontSize: 9,
    lineHeight: 1.4,
    maxWidth: 150,
  },

  mockButton: {
    background: "#4A6FFF",
    color: "#fff",
    padding: "10px 8px",
    borderRadius: 9,
    textAlign: "center",
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 14,
  },

  mockServices: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },

  mockService: {
    background: "#fff",
    borderRadius: 9,
    padding: 9,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #E5E7EB",
  },

  mockServiceIcon: {
    fontSize: 14,
  },

  mockService: {
    background: "#fff",
    borderRadius: 9,
    padding: 9,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #E5E7EB",
  },

  mockService: {
    background: "#fff",
    borderRadius: 9,
    padding: 9,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #E5E7EB",
  },

  phoneBottom: {
    height: 10,
  },


  // ==========================================
  // SEÇÕES
  // ==========================================

  stepsSection: {
    maxWidth: 1000,
    margin: "65px auto 0",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  plansSection: {
    maxWidth: 1150,
    margin: "75px auto 0",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  benefitsSection: {
    maxWidth: 1000,
    margin: "75px auto 0",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  sectionHeader: {
    marginBottom: 25,
  },

  sectionLabel: {
    color: "#4A6FFF",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
  },

  sectionTitle: {
    margin: "8px 0 8px",
    color: "#111827",
    fontSize: 27,
    lineHeight: 1.2,
  },

  sectionDescription: {
    margin: 0,
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 1.5,
  },


  // ==========================================
  // STEPS
  // ==========================================

  steps: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },

  step: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.03)",
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#EEF2FF",
    color: "#4A6FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
  },

  stepTitle: {
    margin: "0 0 5px",
    fontSize: 14,
    color: "#111827",
  },

  stepText: {
    margin: 0,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 1.5,
  },


  // ==========================================
  // PLANOS
  // ==========================================

  plansContainer: {
    display: "grid",
    
    gap: 20,
  },

  card: {
    position: "relative",
    background: "#fff",
    borderRadius: 22,
    padding: 25,
    border: "1px solid #E5E7EB",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  teamCard: {
    border: "2px solid #4A6FFF",
    boxShadow:
      "0 15px 40px rgba(74,111,255,0.12)",
  },

  recommended: {
    position: "absolute",
    top: 0,
    right: 22,
    transform: "translateY(-50%)",
    background: "#4A6FFF",
    color: "#fff",
    padding: "6px 11px",
    borderRadius: 20,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 0.5,
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: 8,
    background: "#F1F5F9",
    color: "#475569",
    fontSize: 9,
    fontWeight: 800,
  },

  badgeTeam: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: 8,
    background: "#EEF2FF",
    color: "#4A6FFF",
    fontSize: 9,
    fontWeight: 800,
  },

  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardIconTeam: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  planTitle: {
    margin: "16px 0 6px",
    fontSize: 21,
    color: "#111827",
  },

  planDescription: {
    margin: 0,
    color: "#6B7280",
    lineHeight: 1.5,
    fontSize: 13,
  },

  priceContainer: {
    margin: "22px 0",
  },

  currency: {
    fontSize: 17,
    color: "#374151",
    marginRight: 3,
  },

  price: {
    fontSize: 38,
    fontWeight: 800,
    color: "#111827",
    letterSpacing: -1,
  },

  paymentType: {
    display: "block",
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 2,
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: 11,
    marginBottom: 25,
    flex: 1,
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    color: "#374151",
    fontSize: 13,
  },

  featureSpan: {
    color: "#16A34A",
    fontWeight: 800,
  },

  primaryButton: {
    width: "100%",
    border: "none",
    background: "#4A6FFF",
    color: "#fff",
    padding: "14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },

  teamButton: {
    width: "100%",
    border: "none",
    background: "#111827",
    color: "#fff",
    padding: "14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },

  lockedButton: {
    width: "100%",
    border: "none",
    background: "#E5E7EB",
    color: "#6B7280",
    padding: "14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },

  premiumMessage: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#F8FAFC",
    borderRadius: 10,
    padding: "9px 11px",
    marginBottom: 12,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 1.4,
  },


  // ==========================================
  // BENEFÍCIOS
  // ==========================================

  benefitsHeader: {
    maxWidth: 650,
    marginBottom: 25,
  },

  benefitsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },

  benefitCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    padding: 18,
  },

  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    background: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  benefitCardTitle: {
    margin: 0,
  },

  benefitCardText: {
    margin: 0,
  },


  // ==========================================
  // CTA
  // ==========================================

  finalCta: {
    maxWidth: 1000,
    margin: "70px auto 0",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  finalCtaContent: {
    background:
      "linear-gradient(135deg, #4A6FFF 0%, #3558D8 100%)",
    borderRadius: 25,
    padding: "40px 25px",
    textAlign: "center",
    color: "#fff",
    boxShadow:
      "0 20px 50px rgba(74,111,255,0.25)",
  },

  finalIcon: {
    fontSize: 28,
  },

  finalTitle: {
    margin: "12px 0 8px",
    fontSize: 27,
    lineHeight: 1.2,
  },

  finalText: {
    margin: "0 auto 22px",
    maxWidth: 520,
    fontSize: 14,
    lineHeight: 1.5,
    opacity: 0.9,
  },

  finalButton: {
    border: "none",
    background: "#fff",
    color: "#4A6FFF",
    padding: "14px 24px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },


  // ==========================================
  // FOOTER
  // ==========================================

  footer: {
    maxWidth: 1000,
    margin: "35px auto 0",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
};


// ==========================================
// RESPONSIVIDADE
// ==========================================

// O layout principal já usa grids fluidos.
// Para telas pequenas, adicionamos CSS global
// através de uma pequena regra inserida no
// componente.

if (
  typeof document !== "undefined" &&
  !document.getElementById("agendly-vitrine-mobile")
) {
  const style = document.createElement("style");

  style.id = "agendly-vitrine-mobile";

  style.innerHTML = `
    @media (max-width: 700px) {

      .agendly-vitrine {}

      body {
        overflow-x: hidden;
      }

    }
  `;

  document.head.appendChild(style);
}
<style>
{`
  * {
    box-sizing: border-box;
  }

  .agendly-vitrine {
    width: 100%;
    overflow-x: hidden;
  }

  /* TABLET */
  @media (max-width: 800px) {

    .agendly-vitrine .previewSection {
      flex-direction: column;
      text-align: center;
    }

    .agendly-vitrine .previewText {
      max-width: 100%;
    }

    .agendly-vitrine .previewBenefits {
      align-items: center;
    }

    .agendly-vitrine .phoneArea {
      width: 100%;
      margin-top: 10px;
    }

    .agendly-vitrine .steps {
      grid-template-columns: repeat(2, 1fr);
    }

    .agendly-vitrine .benefitsGrid {
      grid-template-columns: repeat(2, 1fr);
    }

    .agendly-vitrine .plansContainer {
      grid-template-columns: 1fr;
    }
  }


  /* CELULAR */
  @media (max-width: 600px) {

    .agendly-vitrine {
      width: 100%;
      min-width: 0;
    }

    /* HEADER */

    .agendly-vitrine header {
      padding: 18px 16px 5px !important;
    }

    .agendly-vitrine h1 {
      font-size: 29px !important;
      line-height: 1.15 !important;
    }

    .agendly-vitrine .subtitle {
      font-size: 14px !important;
      line-height: 1.55 !important;
    }


    /* PREVIEW */

    .agendly-vitrine .previewSection {
      padding: 0 16px !important;
      margin-top: 30px !important;
      gap: 25px !important;
    }

    .agendly-vitrine .previewTitle {
      font-size: 24px !important;
    }

    .agendly-vitrine .previewDescription {
      font-size: 14px !important;
    }

    .agendly-vitrine .previewBenefit {
      font-size: 13px !important;
    }


    /* CELULAR MOCKUP */

    .agendly-vitrine .phoneArea {
      width: 100%;
      transform: scale(0.9);
      margin-top: -5px;
      margin-bottom: -20px;
    }

    .agendly-vitrine .phone {
      width: 205px;
      height: 400px;
    }


    /* SEÇÕES */

    .agendly-vitrine .stepsSection,
    .agendly-vitrine .plansSection,
    .agendly-vitrine .benefitsSection,
    .agendly-vitrine .finalCta {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    .agendly-vitrine .stepsSection {
      margin-top: 45px !important;
    }

    .agendly-vitrine .plansSection {
      margin-top: 55px !important;
    }

    .agendly-vitrine .benefitsSection {
      margin-top: 55px !important;
    }


    /* TÍTULOS */

    .agendly-vitrine .sectionTitle {
      font-size: 23px !important;
      line-height: 1.25 !important;
    }

    .agendly-vitrine .sectionDescription {
      font-size: 13px !important;
    }


    /* PASSOS */

    .agendly-vitrine .steps {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
    }

    .agendly-vitrine .step {
      flex-direction: row !important;
      align-items: flex-start !important;
      padding: 15px !important;
      gap: 12px !important;
    }

    .agendly-vitrine .stepNumber {
      flex-shrink: 0;
    }


    /* PLANOS */

    .agendly-vitrine .plansContainer {
      grid-template-columns: 1fr !important;
      gap: 18px !important;
    }

    .agendly-vitrine .card {
      width: 100%;
      padding: 21px !important;
      border-radius: 18px !important;
    }

    .agendly-vitrine .planTitle {
      font-size: 20px !important;
    }

    .agendly-vitrine .planDescription {
      font-size: 13px !important;
    }

    .agendly-vitrine .price {
      font-size: 36px !important;
    }

    .agendly-vitrine .feature {
      font-size: 13px !important;
    }

    .agendly-vitrine .primaryButton,
    .agendly-vitrine .teamButton,
    .agendly-vitrine .lockedButton {
      min-height: 50px;
      font-size: 14px !important;
    }


    /* BENEFÍCIOS */

    .agendly-vitrine .benefitsGrid {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
    }

    .agendly-vitrine .benefitCard {
      padding: 16px !important;
    }


    /* CTA FINAL */

    .agendly-vitrine .finalCta {
      margin-top: 50px !important;
    }

    .agendly-vitrine .finalCtaContent {
      padding: 32px 18px !important;
      border-radius: 20px !important;
    }

    .agendly-vitrine .finalTitle {
      font-size: 24px !important;
    }

    .agendly-vitrine .finalText {
      font-size: 13px !important;
    }

    .agendly-vitrine .finalButton {
      width: 100%;
      min-height: 50px;
    }


    /* FOOTER */

    .agendly-vitrine footer {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
  }


  /* CELULARES MUITO PEQUENOS */

  @media (max-width: 380px) {

    .agendly-vitrine h1 {
      font-size: 26px !important;
    }

    .agendly-vitrine .previewTitle {
      font-size: 22px !important;
    }

    .agendly-vitrine .phone {
      transform: scale(0.9);
    }

    .agendly-vitrine .card {
      padding: 18px !important;
    }

    .agendly-vitrine .price {
      font-size: 32px !important;
    }
  }
`}
</style>


export default PaginaAgendamento;