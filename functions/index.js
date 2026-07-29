const { onCall, onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.enviarTeste = onCall(async (request) => {

  const token = request.data.token;

  await admin.messaging().send({
    token,
    notification: {
      title: "Agendly 🔔",
      body: "Seu primeiro push notification funcionou!"
    }
  });

  return {
    sucesso: true
  };

});

exports.metricasAgendly = onRequest(async (req, res) => {

  try {

    const db = admin.firestore();

    const [
      usuarios,
      equipe,
      agendamentos,
      premium
    ] = await Promise.all([
      db.collection("usuarios").get(),
      db.collection("equipe").get(),
      db.collection("agendamentos").get(),
      db.collection("usuarios")
        .where("plano", "==", "premium")
        .get()
    ]);

    res.json({
      usuarios: usuarios.size,
      premium: premium.size,
      equipe: equipe.size,
      agendamentos: agendamentos.size
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      erro: e.message
    });
  }

});