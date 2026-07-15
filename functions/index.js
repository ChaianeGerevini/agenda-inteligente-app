const { onCall } = require("firebase-functions/v2/https");
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