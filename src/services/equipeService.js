import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function criarGestorNaEquipe(user, empresa) {
  try {
    // Busca o usuário no Firestore
    const usuarioRef = doc(db, "usuarios", user.uid);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      throw new Error("Usuário não encontrado no Firestore.");
    }

    const usuarioData = usuarioSnap.data();

    // Pega o nome cadastrado no onboarding
    const nomeUsuario =
      usuarioData.nome ||
      usuarioData.nomePerfil ||
      user.displayName ||
      "";

    // Cria o proprietário na equipe
    await addDoc(collection(db, "equipe"), {
      nome: nomeUsuario,
      cargo: "Proprietário",
      telefone: usuarioData.telefonePerfil || "",
      comissao: 0,
      cor: "#4A6FFF",
      status: "ativo",

      empresaId: empresa.empresaId,
      gestorId: empresa.gestorId,
      usuarioId: user.uid,

      createdAt: serverTimestamp(),
    });

    console.log("Proprietário criado na equipe:", nomeUsuario);

  } catch (error) {
    console.error("Erro ao criar proprietário na equipe:", error);
    throw error;
  }
}