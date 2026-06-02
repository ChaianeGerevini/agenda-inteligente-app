// Ao entrar na pagina inicial, após login //

import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  async function sair() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (erro) {
      console.error(erro);
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Bem-vinda à Agenda Inteligente 🚀</p>

      <button onClick={sair}>
        Sair
      </button>
    </div>
  );
}

export default Dashboard;