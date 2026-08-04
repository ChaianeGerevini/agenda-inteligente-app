import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function criarGestorNaEquipe(user, empresa) {
  await addDoc(collection(db, "equipe"), {
     nome: user.displayName || "",
  cargo: "Proprietário",
  telefone: "",
  comissao: 0,
  cor: "#4A6FFF",

  status: "ativo",

  empresaId: empresa.empresaId,
  gestorId: empresa.gestorId,
  usuarioId: user.uid,

  createdAt: serverTimestamp(),
});
}