import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import {
  loginEmail,
  registerEmail,
  loginGoogle,
  recuperarSenha as recuperarSenhaAuth,
} from "../../services/authService";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/agendly-logo.jpg";

import {
  criarEstruturaInicial,
} from "../../services/companyService";

import {
  atualizarUltimoAcesso,
} from "../../services/userService";



function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");


const [searchParams] = useSearchParams();

const conviteId = searchParams.get("convite");
const referral = searchParams.get("ref");


  const navigate = useNavigate();
    const { usuario, loadingUser } = useUser();
    const redirecionarUsuario = () => {

  if(usuario?.onboardingCompleto){

    navigate("/Faturamento");

  } else {

    navigate("/onboarding");

  }

};

useEffect(()=>{

  if(!loadingUser && usuario){

    redirecionarUsuario();

  }

},[
loadingUser,
usuario
]);

  
const recuperarSenha = async () => {
  try {
    setErro("");
    setMensagem("");

    await recuperarSenhaAuth(email);

    setMensagem("📩 Enviamos um link de recuperação para o seu e-mail.");
  } catch {
    setMensagem("");
    setErro("❌ Não foi possível enviar o e-mail.");
  }
};

async function cadastrar(){

  setLoading(true);
  setErro("");

  try {

    const user =
      await registerEmail(
        email,
        senha
      );


    await criarEstruturaInicial({
      user,
      conviteId,
      referral
    });


    navigate("/onboarding");


  } catch(err){

    console.error(err);
    setErro(err.message);

  } finally {

    setLoading(false);

  }

}

async function entrarComGoogle() {

  setLoading(true);
  setErro("");

  try {

    const user = await loginGoogle();

    await criarEstruturaInicial({
      user,
      conviteId,
      referral
    });

navigate("/onboarding");

  } catch (err) {

    console.error(err);
    setErro(err.message);

  } finally {

    setLoading(false);

  }

}
async function entrar() {

  setLoading(true);
  setErro("");

  try {

    const user =
      await loginEmail(
        email,
        senha
      );


    await atualizarUltimoAcesso(
      user.uid
    );

  } catch (erro) {

    setErro(
      "Email ou senha inválidos"
    );


  } finally {

    setLoading(false);

  }

}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
  src={logo}
  alt="Agendly"
  style={styles.logo}
/>
        <h1 style={styles.title}>Agenda Inteligente</h1>
        <p style={styles.subtitle}>Organize seus clientes e horários</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          onFocus={(e) =>
            (e.target.style.border = "1px solid #4A6FFF")
          }
          onBlur={(e) =>
            (e.target.style.border = "1px solid #e5e7eb")
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
          onFocus={(e) =>
            (e.target.style.border = "1px solid #4A6FFF")
          }
          onBlur={(e) =>
            (e.target.style.border = "1px solid #e5e7eb")
          }
        />

        {/* 👇 BOTÕES AGRUPADOS CORRETAMENTE */}
        <div style={styles.buttonGroup}>
          <button
            onClick={entrar}
            style={styles.primaryButton}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
    onClick={entrarComGoogle}
    style={styles.googleButton}
>
    Continuar com Google
</button>

          <button
            onClick={cadastrar}
            style={styles.secondaryButton}
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Conta"}
          </button>

          <button
  onClick={recuperarSenha}
  style={styles.linkButton}
>
  Esqueci minha senha
</button>
{mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
{erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    background: "#F4F7FF",
    fontFamily: "Arial",
  },

  card: {
    width: "100%",
    maxWidth: 380,
    padding: 30,
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: 22,
    marginBottom: 5,
    color: "#1f2937",
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    marginBottom: 25,
    color: "#6b7280",
  },

  input: {
    width: "90%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#111827",
    outline: "none",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12, // 👈 substitui marginBottom
    marginTop: 10,
  },

  primaryButton: {
    width: "100%",
    padding: 14,
    background: "#4A6FFF",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
  },

  secondaryButton: {
    width: "100%",
    padding: 14,
    background: "#EEF2FF",
    color: "#4A6FFF",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
  },

  error: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 10,
  },

  logo: {
  width: 120,
  height: "auto",
  marginBottom: 20,
  borderRadius: 50,
},

linkButton: {
  marginTop: 5,
  background: "transparent",
  border: "none",
  color: "#4A6FFF",
  cursor: "pointer",
  fontSize: 13,
  textDecoration: "underline",
},
googleButton: {
  width: "100%",
  padding: 14,
  background: "#fff",
  color: "#444",
  border: "1px solid #dadce0",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 16,
},
};

export default Login;