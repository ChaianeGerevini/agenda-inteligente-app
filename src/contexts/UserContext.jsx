import {
  createContext,
  useContext,
  useEffect,
  useState,
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

  // Assinantes pagos
  if (
    usuario?.plano === "premium" ||
    usuario?.plano === "plus"
  ) {
    return true;
  }


  // Premium por teste ou indicação
  if (usuario?.premiumUntil) {

    const validade = usuario.premiumUntil.toDate
      ? usuario.premiumUntil.toDate()
      : new Date(usuario.premiumUntil);

    return validade > new Date();
  }

  return false;
};


const isPlus = () => {

  // Assinante Plus real
  if (usuario?.plano === "plus") {
    return true;
  }

  // Teste grátis ou prêmio por indicação
  if (usuario?.premiumUntil) {

    const validade = usuario.premiumUntil.toDate
      ? usuario.premiumUntil.toDate()
      : new Date(usuario.premiumUntil);

    if (validade > new Date()) {
      return true;
    }
  }
  return false;
};
const getPlanoAtual = () => {

if (usuario?.plano === "premium") {
  return {
    nome: "Premium",
    tipo: "premium",
    descricao: "Assinatura ativa"
  };
}
  


  if (usuario?.plano === "premium") {
    return {
     nome: "Premium Plus",
tipo: "teste",
      descricao: "Assinatura ativa"
    };
  }


  if (usuario?.premiumUntil) {

    const validade = usuario.premiumUntil.toDate
      ? usuario.premiumUntil.toDate()
      : new Date(usuario.premiumUntil);


    if (validade > new Date()) {

      const diasRestantes = Math.ceil(
        (validade - new Date()) /
        (1000 * 60 * 60 * 24)
      );

      if (usuario?.statusAssinatura === "teste") {
        return {
         nome: "Premium Plus",
tipo: "teste",
          descricao:
            `Teste grátis • ${diasRestantes} dias restantes`
        };
      }


      return {
       nome: "Premium Plus",
tipo: "bonus",
        descricao:
          `Bônus de indicação • ${diasRestantes} dias restantes`
      };

    }
  }


  return {
    nome: "Free",
    tipo: "free",
    descricao: "Plano gratuito"
  };
};

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


  // ⏰ Verifica se o período Premium expirou
  if (
    dados.premiumUntil &&
    dados.plano === "free"
  ) {

    const validade = dados.premiumUntil.toDate
      ? dados.premiumUntil.toDate()
      : new Date(dados.premiumUntil);


    if (validade < new Date()) {

      updateDoc(ref, {
        premiumUntil: null,
        statusAssinatura: "expirado"
      });

      dados.premiumUntil = null;
      dados.statusAssinatura = "expirado";
    }
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
  isPlus,
  getPlanoAtual
}}
    >
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  return useContext(UserContext);
}