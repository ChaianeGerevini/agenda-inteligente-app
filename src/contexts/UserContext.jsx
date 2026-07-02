import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { 
  onAuthStateChanged 
} from "firebase/auth";

import {
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

const isPremium = () => {

  // Premium pago
  if (usuario?.plano === "premium") {
    return true;
  }

  // Trial novo (15 dias)
  if (usuario?.plano === "trial" && usuario?.trialFim) {
    const validade = usuario.trialFim.toDate
      ? usuario.trialFim.toDate()
      : new Date(usuario.trialFim);

    return validade > new Date();
  }

  // Compatibilidade legado
  if (usuario?.premiumUntil) {
    const validade = usuario.premiumUntil.toDate
      ? usuario.premiumUntil.toDate()
      : new Date(usuario.premiumUntil);

    return validade > new Date();
  }

  return false;
};
const isTrialActive = () => {
  if (!usuario?.trialFim) return false;

  const fim = usuario.trialFim.toDate
    ? usuario.trialFim.toDate()
    : new Date(usuario.trialFim);

  return new Date() < fim;
};

const hasAccess = () => {
  return isPremium() || isTrialActive();
};

const isBlocked = () => {
  return !hasAccess();
};

const getPlanoAtual = () => {

  // PREMIUM
  if (usuario?.plano === "premium") {
    return {
      nome: "Premium",
      tipo: "premium",
      descricao: "Assinatura ativa"
    };
  }

  // TRIAL NOVO
  if (usuario?.plano === "trial" && usuario?.trialFim) {

    const validade = usuario.trialFim.toDate
      ? usuario.trialFim.toDate()
      : new Date(usuario.trialFim);

    const diasRestantes = Math.ceil(
      (validade - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (validade > new Date()) {
      return {
        nome: "Premium (Trial)",
        tipo: "trial",
        descricao: `Teste grátis • ${diasRestantes} dias restantes`
      };
    }

    return {
      nome: "Free",
      tipo: "expirado",
      descricao: "Trial expirado"
    };
  }

  // LEGADO (premiumUntil)
  if (usuario?.premiumUntil) {

    const validade = usuario.premiumUntil.toDate
      ? usuario.premiumUntil.toDate()
      : new Date(usuario.premiumUntil);

    if (validade > new Date()) {

      const diasRestantes = Math.ceil(
        (validade - new Date()) / (1000 * 60 * 60 * 24)
      );

      return {
        nome: "Premium",
        tipo: usuario?.statusAssinatura === "teste" ? "trial_legado" : "bonus",
        descricao: `Premium ativo • ${diasRestantes} dias restantes`
      };
    }
  }

  // FREE
  return {
    nome: "Free",
    tipo: "free",
    descricao: "Plano gratuito"
  };
};

const trialCriadoRef = useRef(false);

  useEffect(() => {

    let unsubscribeUser = null;


    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {


        // Saiu da conta
        if (!firebaseUser) {
          setUsuario(null);
          setLoadingUser(false);

          if (unsubscribeUser) {
            unsubscribeUser();
          }

          return;
        }


        // Escuta o documento do usuário
        const ref = doc(
          db,
          "usuarios",
          firebaseUser.uid
        );


        unsubscribeUser = onSnapshot(
          ref,
          (snapshot) => {

            if (snapshot.exists()) {

  const dados = snapshot.data();

// =======================================
// AUTO TRIAL (NOVO USUÁRIO)
// =======================================

const jaTemPlano = !!dados.plano;
const jaTemTrial = !!dados.trialFim;

if (!jaTemPlano && !jaTemTrial && !trialCriadoRef.current) {

  trialCriadoRef.current = true;

  const agora = new Date();
  const fim = new Date();
  fim.setDate(agora.getDate() + 15);

  updateDoc(ref, {
    plano: "trial",
    statusAssinatura: "trial",
    trialInicio: agora,
    trialFim: fim,
  });

  dados.plano = "trial";
  dados.statusAssinatura = "trial";
  dados.trialInicio = agora;
  dados.trialFim = fim;
}


  setUsuario({
    uid: firebaseUser.uid,
    ...dados
  });

} else {
  setUsuario(null);

            }
            


            setLoadingUser(false);

          },
          (erro) => {
            console.log(
              "Erro ao ouvir usuário:",
              erro
            );

            setLoadingUser(false);
          }
        );

      }
    );


    return () => {

      unsubscribeAuth();

      if (unsubscribeUser) {
        unsubscribeUser();
      }

    };

  }, []);


  return (
   <UserContext.Provider
  value={{
    usuario,
    loadingUser,
    isPremium,
    getPlanoAtual,
    maxEquipe: usuario?.plano === "premium" ? Infinity : 1,

    // 🔥 NOVO
    isTrialActive,
    hasAccess,
    isBlocked,
  }}
>
      
      {children}
    </UserContext.Provider>
  );
}

export function podeAdicionarMembro(usuario, totalEquipe) {
  if (usuario?.plano === "premium") return true;

  return totalEquipe < 1;
}

export function useUser() {
  return useContext(UserContext);
}