import { FirebaseMessaging } from "@capacitor-firebase/messaging";


export async function iniciarNotificacoes(){

    const permission =
        await FirebaseMessaging.requestPermissions();


    if(permission.receive !== "granted"){
        return;
    }


    const token =
        await FirebaseMessaging.getToken();


    console.log(
        "TOKEN PUSH:",
        token.token
    );


    return token.token;
}