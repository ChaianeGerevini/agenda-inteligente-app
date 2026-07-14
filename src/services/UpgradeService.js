import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";


// =======================================
// PREMIUM
// =======================================

export async function upgradeParaPremium(uid) {
  try {
    const usuarioRef = doc(db, "usuarios", uid);

    await updateDoc(usuarioRef, {
      plano: "premium",
      statusAssinatura: "ativa",
    });

    return {
      sucesso: true,
      mensagem: "Premium ativado com sucesso!",
    };

  } catch (erro) {
    console.error("Erro ao ativar Premium:", erro);

    return {
      sucesso: false,
      mensagem: "Erro ao ativar Premium.",
    };
  }
}

// =======================================
// CANCELAMENTO
// =======================================

export async function cancelarAssinatura(uid) {

  try {

    const usuarioRef = doc(db, "usuarios", uid);

    await updateDoc(usuarioRef, {

      plano: "free",
      statusAssinatura: "cancelada",
    });


    return {
      sucesso: true,
      mensagem: "Assinatura cancelada.",
    };


  } catch (erro) {

    console.error(
      "Erro ao cancelar assinatura:",
      erro
    );

    return {
      sucesso: false,
      mensagem: "Erro ao cancelar assinatura.",
    };
  }
}