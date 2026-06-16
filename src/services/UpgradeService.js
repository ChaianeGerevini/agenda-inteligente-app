import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { generateCompanyId } from "../contexts/generateCompanyId";


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
// PREMIUM PLUS - VIRA GESTOR
// =======================================

export async function upgradeParaPlus(uid) {
  try {

    const empresaId = generateCompanyId();

    const usuarioRef = doc(db, "usuarios", uid);

    await updateDoc(usuarioRef, {
      perfil: "gestor",
      role: "owner",

      plano: "plus",
      statusAssinatura: "ativa",

      empresaId: empresaId,
      gestorId: uid,
    });

    return {
      sucesso: true,
      empresaId,
      mensagem: "Agora você é um gestor Premium Plus!",
    };

  } catch (erro) {

    console.error("Erro no Premium Plus:", erro);

    return {
      sucesso: false,
      mensagem: "Não foi possível ativar o Premium Plus.",
    };
  }
}


// =======================================
// ENTRADA POR CONVITE
// =======================================

export async function virarColaborador(
  uid,
  empresaId,
  gestorId
) {

  try {

    const usuarioRef = doc(db, "usuarios", uid);

    await updateDoc(usuarioRef, {

      perfil: "colaborador",
      role: "colaborador",

      empresaId: empresaId,
      gestorId: gestorId,

      // Mantém como plano gratuito
      plano: "free",
    });


    return {
      sucesso: true,
      mensagem: "Você entrou na equipe com sucesso!",
    };


  } catch (erro) {

    console.error(
      "Erro ao entrar na equipe:",
      erro
    );


    return {
      sucesso: false,
      mensagem: "Erro ao entrar na equipe.",
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