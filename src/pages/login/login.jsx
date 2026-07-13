import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../../services/firebase";
import { signInWithPopup } from "firebase/auth";
import logo from "/src/assets/agendly-logo.jpg";
import { generateReferralCode } from "/src/contexts/generateReferralCode.js";


import {
  doc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  getDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";


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
  
const recuperarSenha = async () => {
  try {
    setErro("");
    setMensagem("");

    await sendPasswordResetEmail(auth, email);

    setMensagem("📩 Enviamos um link de recuperação para o seu e-mail.");
  } catch (error) {
    setMensagem("");
    setErro("❌ Não foi possível enviar o e-mail. Verifique o endereço.");
  }
};


async function cadastrar() {
  setLoading(true);
  setErro("");

  console.log("conviteId:", conviteId);
  console.log("referral:", referral);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    const referralCode = generateReferralCode(email);

    let empresaId;
    let gestorId;
    let role = "gestor";

    // 👇 CASO 1: convite de equipe
    if (conviteId) {
      const conviteSnap = await getDoc(doc(db, "convites", conviteId));
     

      if (!conviteSnap.exists()) {
    throw new Error("Convite inválido");
  }

  const convite = conviteSnap.data();

  empresaId = convite.empresaId;
  gestorId = convite.gestorId;
  role = "funcionario";

  await updateDoc(doc(db, "convites", conviteId), {
    usado: true,
    usuarioId: user.uid,
    usadoEm: serverTimestamp(),
  });
}

    // 👇 CASO 2: cadastro normal OU indicação
    else {
      const empresaRef = await addDoc(collection(db, "empresas"), {
        nome: "Minha Empresa",
        ownerId: user.uid,
        plano: "teste",
        createdAt: serverTimestamp(),
      });

      empresaId = empresaRef.id;
      gestorId = user.uid;
    }

    // 👇 salva usuário
  await setDoc(doc(db, "usuarios", user.uid), {
  email,
  empresaId,
  gestorId,
  role,

  plano: "trial",
  premiumUntil: serverTimestamp(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  ),

  createdAt: serverTimestamp(),
  lastLogin: serverTimestamp(),

  referralCode,
  referredBy: referral || null,
  referralsCount: 0,
});

    // 👇 INDICAÇÃO (contabilizar quem indicou)
    if (referral) {
      const q = query(
        collection(db, "usuarios"),
        where("referralCode", "==", referral)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {

      for (const docItem of snap.docs) {
        const refUser = doc(db, "usuarios", docItem.id);

        const atual = docItem.data().referralsCount || 0;
        const novo = atual + 1;

        const updateData = {
          referralsCount: novo,
        };

        if (novo >= 5) {
          updateData.premiumUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          updateData.referralsCount = 0;
        }

        await updateDoc(refUser, updateData);
      }
    }
  }

    navigate("/Faturamento");

  } catch (err) {
    setErro(err.message);
  } finally {
    setLoading(false);
  }
}
async function entrarComGoogle() {
  setLoading(true);
  setErro("");

  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    // Usuário já existe
    if (userSnap.exists()) {

      await updateDoc(userRef, {
        ultimoAcesso: serverTimestamp(),
      });

      navigate("/Faturamento");
      return;
    }

    // ========= PRIMEIRO LOGIN =========

    const referralCode = generateReferralCode(user.email);

    let empresaId;
    let gestorId;
    let role = "gestor";

    // convite
    if (conviteId) {

      const conviteSnap = await getDoc(doc(db, "convites", conviteId));

      if (!conviteSnap.exists()) {
        throw new Error("Convite inválido");
      }

      const convite = conviteSnap.data();

      empresaId = convite.empresaId;
      gestorId = convite.gestorId;
      role = "funcionario";

      await updateDoc(doc(db, "convites", conviteId), {
        usado: true,
        usuarioId: user.uid,
        usadoEm: serverTimestamp(),
      });

    } else {

      const empresaRef = await addDoc(collection(db, "empresas"), {
        nome: "Minha Empresa",
        ownerId: user.uid,
        plano: "teste",
        createdAt: serverTimestamp(),
      });

      empresaId = empresaRef.id;
      gestorId = user.uid;
    }

    await setDoc(userRef, {

      email: user.email,
      nome: user.displayName,
      foto: user.photoURL,

      empresaId,
      gestorId,
      role,

      plano: "trial",

      premiumUntil: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ),

      createdAt: serverTimestamp(),
      ultimoAcesso: serverTimestamp(),

      referralCode,
      referredBy: referral || null,
      referralsCount: 0,
    });

    // contabiliza indicação
    if (referral) {

      const q = query(
        collection(db, "usuarios"),
        where("referralCode", "==", referral)
      );

      const snap = await getDocs(q);

      for (const docItem of snap.docs) {

        const atual = docItem.data().referralsCount || 0;

        const updateData = {
          referralsCount: atual + 1,
        };

        if (atual + 1 >= 5) {
          updateData.premiumUntil = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          );
          updateData.referralsCount = 0;
        }

        await updateDoc(doc(db, "usuarios", docItem.id), updateData);
      }
    }

    navigate("/Faturamento");

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
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

const user = userCredential.user;

// pega dados do usuário
const userRef = doc(db, "usuarios", user.uid);
const userSnap = await getDoc(userRef);
const userData = userSnap.data();


// atualiza último acesso
await setDoc(
  userRef,
  {
    ultimoAcesso: serverTimestamp(),
  },
  { merge: true }
);


    navigate("/Faturamento");
  } catch (erro) {
    setErro("Email ou senha inválidos");
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