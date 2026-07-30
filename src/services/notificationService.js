import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

export async function iniciarNotificacoes(usuario) {
  const permission = await FirebaseMessaging.requestPermissions();

  if (permission.receive !== "granted") {
    return;
  }

  const { token } = await FirebaseMessaging.getToken();

  await updateDoc(doc(db, "usuarios", usuario.uid), {
    pushToken: token,
  });

  console.log("TOKEN PUSH:", token);

  return token;
}

const functions = getFunctions(app);

export async function enviarPushTeste(token) {
  const enviarTeste = httpsCallable(
    functions,
    "enviarTeste"
  );

  const resultado = await enviarTeste({
    token,
  });

  console.log(resultado.data);
}