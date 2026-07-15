import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  signInWithCredential,
} from "firebase/auth";


import {
  auth,
  googleProvider,
} from "./firebase";

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

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

    const result = await FirebaseAuthentication.signInWithGoogle();

    const credential =
        result.credential;

    if (!credential?.idToken) {
        throw new Error(
            "Não foi possível obter o token do Google"
        );
    }


    const firebaseCredential =
        await import("firebase/auth")
        .then(({ GoogleAuthProvider }) =>
            GoogleAuthProvider.credential(
                credential.idToken
            )
        );


    const userCredential =
        await signInWithCredential(
            auth,
            firebaseCredential
        );


    return userCredential.user;

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