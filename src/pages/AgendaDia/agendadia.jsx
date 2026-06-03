import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

function AgendaDia() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "agendamentos"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAgendamentos(lista);
      }
    );

    return () => unsub();
  }, []);

  const hoje = new Date()
    .toISOString()
    .split("T")[0];

  const agendaHoje = agendamentos
    .filter((a) => a.data === hoje)
    .sort((a, b) =>
      (a.hora || "").localeCompare(b.hora || "")
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>Agenda de Hoje</h1>

      {agendaHoje.length === 0 ? (
        <p>Nenhum atendimento hoje</p>
      ) : (
        agendaHoje.map((a) => (
          <div
            key={a.id}
            style={{
              background: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <h3>{a.hora}</h3>

            <p>
              <b>{a.cliente}</b>
            </p>

            <p>{a.titulo}</p>

            <p>R$ {a.valor}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AgendaDia;