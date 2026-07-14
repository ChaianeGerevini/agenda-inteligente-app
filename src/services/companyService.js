import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

import {
  usuarioExiste,
  criarUsuario,
  atualizarUltimoAcesso,
} from "./userService";

import {
  registrarIndicacao,
  generateReferralCode,
} from "./referralService";


// Cria uma nova empresa quando o usuário é gestor
export async function criarEmpresa(user) {

    const empresaRef =
        await addDoc(
            collection(db, "empresas"),
            {

                nome: "Minha Empresa",

                ownerId: user.uid,

                plano: "teste",

                createdAt: serverTimestamp(),

            }
        );


    return {

        empresaId: empresaRef.id,

        gestorId: user.uid,

        role: "gestor",

    };

}


// Aceita convite de equipe
export async function aceitarConvite(
    conviteId,
    user
) {


    const conviteRef =
        doc(
            db,
            "convites",
            conviteId
        );


    const conviteSnap =
        await getDoc(conviteRef);


    if (!conviteSnap.exists()) {

        throw new Error(
            "Convite inválido"
        );

    }


    const convite =
    conviteSnap.data();


if(convite.usado){

    throw new Error(
        "Este convite já foi utilizado"
    );

}


if(convite.email && convite.email !== user.email){

    throw new Error(
        "Este convite pertence a outro email"
    );

}


    await updateDoc(
        conviteRef,
        {

            usado: true,

            usuarioId: user.uid,

            usadoEm: serverTimestamp(),

        }
    );


    return {

        empresaId: convite.empresaId,

        gestorId: convite.gestorId,

        role: "funcionario",

    };

}


// Decide se cria empresa ou usa convite
export async function obterEmpresaDoUsuario(
    user,
    conviteId
){


    if(conviteId){

        return await aceitarConvite(
            conviteId,
            user
        );

    }


    return await criarEmpresa(user);

}



// Cria toda estrutura inicial do usuário
export async function criarEstruturaInicial({
    

    user,

    conviteId,

    referral,

}){


    // 1 - Verifica se usuário já existe

    const existe =
        await usuarioExiste(
            user.uid
        );


if(existe){

    await atualizarUltimoAcesso(
        user.uid
    );


    return {
        novoUsuario: false
    };

}



    // 2 - Cria empresa ou aceita convite

    const empresa =
        await obterEmpresaDoUsuario(
            user,
            conviteId
        );

const referralCode =
    generateReferralCode(user.email);

    // 3 - Cria usuário no Firestore

    await criarUsuario(
        user.uid,
        {

            email: user.email,

            nome:
              user.displayName || "",

            foto:
              user.photoURL || "",


            empresaId:
              empresa.empresaId,


            gestorId:
              empresa.gestorId,


            role:
              empresa.role,

plano: "free",

            createdAt:
              serverTimestamp(),


            ultimoAcesso:
              serverTimestamp(),



      referralCode,

referredBy:
    referral || null,


            referralsCount: 0,

        }
    );



    // 4 - Registra indicação

    await registrarIndicacao(
        referral
    );



    return {
    novoUsuario: true,
    empresa
};

}