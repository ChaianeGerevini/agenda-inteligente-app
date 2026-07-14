import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  isPremium,
  hasAccess,
  isBlocked
} from "../services/planService";

import { 
  onAuthStateChanged 
} from "firebase/auth";

import {
  doc,
  onSnapshot
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [usuario, setUsuario] = useState(null);
const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {

    let unsubscribeUser = null;


    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {


        // Saiu da conta
        if (!firebaseUser) {
          setUsuario(null);
          setLoading(false);

          if (unsubscribeUser) {
            unsubscribeUser();
                unsubscribeUser = null;
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

  isPremium: () => isPremium(usuario),

  hasAccess: () => hasAccess(usuario),

  isBlocked: () => isBlocked(usuario),

  maxEquipe: usuario?.plano === "premium"
    ? Infinity
    : 1,
}}
>
      
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  return useContext(UserContext);
}