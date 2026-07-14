import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "./firebase";

export async function loginEmail(email, senha) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

  return userCredential.user;
}

export async function registerEmail(email, senha) {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

  return userCredential.user;

}

import { Capacitor } from "@capacitor/core";

export async function loginGoogle() {

    if (Capacitor.isNativePlatform()) {

        return await loginGoogleAndroid();

    }

    const result = await signInWithPopup(
        auth,
        googleProvider
    );

    return result.user;
}

async function loginGoogleAndroid() {

    throw new Error("Login Google Android ainda não implementado.");

}

export async function recuperarSenha(email){

    return await sendPasswordResetEmail(
        auth,
        email
    );

}

export async function logout(){

    await signOut(auth);

}