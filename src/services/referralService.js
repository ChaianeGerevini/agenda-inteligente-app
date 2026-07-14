import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";


export async function registrarIndicacao(referral) {

    // Se não veio código de indicação, não faz nada
    if (!referral) return;


    // Procura o usuário dono do código
    const q = query(
        collection(db, "usuarios"),
        where(
            "referralCode",
            "==",
            referral
        )
    );


    const snap = await getDocs(q);


    // Código inválido ou usuário não encontrado
    if (snap.empty) return;



    // Atualiza o contador de quem indicou
    for (const docItem of snap.docs) {


        const userRef = doc(
            db,
            "usuarios",
            docItem.id
        );


        const atual =
            docItem.data().referralsCount || 0;


        const novo =
            atual + 1;



        const updateData = {

            referralsCount: novo,

        };



        // A cada 5 indicações libera 30 dias Premium
        if (novo >= 5) {


            updateData.premiumUntil =
                new Date(
                    Date.now()
                    +
                    30 *
                    24 *
                    60 *
                    60 *
                    1000
                );


            // zera para começar novo ciclo
            updateData.referralsCount = 0;

        }



        await updateDoc(
            userRef,
            updateData
        );

    }

}

export function generateReferralCode(email) {

    if(!email) return null;


    return email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0,8)
        +
        Math.floor(
            Math.random() * 1000
        );

}