import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

function Convite() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

 useEffect(() => {
  if (codigo) {
    buscarConvite();
  }
}, [codigo]);

async function buscarConvite() {
  try {
    const q = query(
      collection(db, "convites"),
      where("codigo", "==", codigo),
      where("usado", "==", false)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setErro("Este convite é inválido ou já foi utilizado.");
      setLoading(false);
      return;
    }

    const conviteDoc = snapshot.docs[0];

    const conviteId = conviteDoc.id;

    navigate(`/login?convite=${conviteId}`, {
      replace: true,
    });

  } catch (error) {
    console.error(error);
    setErro("Erro ao validar o convite.");
  } finally {
    setLoading(false);
  }

  }


  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🔄 Validando convite...</h2>
          <p>Aguarde um momento.</p>
        </div>
      </div>
    );
  }


  if (erro) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>❌</h1>
          <h2>Convite não encontrado</h2>
          <p>{erro}</p>
        </div>
      </div>
    );
  }
  return null;
}


const styles = {
  container: {
    height: "100vh",
    background: "#F5F7FB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },


  card: {
    width: "100%",
    maxWidth: 420,
    background: "#FFF",
    borderRadius: 24,
    padding: 30,
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,.08)",
  },


  logo: {
    fontSize: 45,
    marginBottom: 10,
  },


  title: {
    marginBottom: 15,
    color: "#111827",
  },


  text: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 1.5,
    marginBottom: 25,
  },


  primaryButton: {
    width: "100%",
    padding: 14,
    background: "#4A6FFF",
    color: "#FFF",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 10,
  },


  secondaryButton: {
    width: "100%",
    padding: 14,
    background: "#EEF2FF",
    color: "#4A6FFF",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },
};


export default Convite;