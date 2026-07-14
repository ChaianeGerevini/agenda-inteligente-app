import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function buscarUsuario(uid) {

    const snap =
        await getDoc(doc(db, "usuarios", uid));

    if (!snap.exists()) return null;

    return snap.data();

}

export async function usuarioExiste(uid) {

    const snap =
        await getDoc(doc(db, "usuarios", uid));

    return snap.exists();

}

export async function atualizarUltimoAcesso(uid) {

    await updateDoc(
        doc(db, "usuarios", uid),
        {
            ultimoAcesso: serverTimestamp(),
        }
    );

}

export async function criarUsuario(uid, dados) {

    await setDoc(
        doc(db, "usuarios", uid),
        dados
    );

}