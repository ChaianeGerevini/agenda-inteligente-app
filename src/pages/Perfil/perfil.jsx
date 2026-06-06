import "./Perfil.css";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

function Perfil() {
  const [usuario] = useState({
    nome: "Chaiane",
    email: "chaiane@email.com",
    telefone: "(51) 99999-9999",
    foto:
      "https://ui-avatars.com/api/?name=Chaiane&background=random",
    plano: "Premium",
  });

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <img
          src={usuario.foto}
          alt="Perfil"
          className="perfil-avatar"
        />

        <h2>{usuario.nome}</h2>
        <p>{usuario.email}</p>

        <button className="btn-foto">
          Alterar Foto
        </button>
      </div>

      <div className="perfil-card">
        <h3>Informações</h3>

        <div className="info-item">
          <span>Nome</span>
          <strong>{usuario.nome}</strong>
        </div>

        <div className="info-item">
          <span>Email</span>
          <strong>{usuario.email}</strong>
        </div>

        <div className="info-item">
          <span>Telefone</span>
          <strong>{usuario.telefone}</strong>
        </div>

        <button className="btn-editar">
          Editar Dados
        </button>
      </div>

      <div className="perfil-card">
        <h3>Plano</h3>

        <div className="plano-box">
          <div>
            <h4>{usuario.plano}</h4>
            <p>Acesso completo às funcionalidades.</p>
          </div>

          <button className="btn-upgrade">
            Gerenciar Plano
          </button>
        </div>
      </div>

      <div className="perfil-card">
        <h3>Configurações</h3>

        <div className="config-item">
          <span>Alterar Senha</span>
          <span>›</span>
        </div>

        <div className="config-item">
          <span>Notificações</span>
          <span>›</span>
        </div>

        <div className="config-item">
          <span>Tema Escuro</span>
          <span>›</span>
        </div>

        <div className="config-item">
          <span>Privacidade</span>
          <span>›</span>
        </div>
      </div>

      <button
        className="btn-logout"
        onClick={handleLogout}
      >
        Sair da Conta
      </button>
    </div>
  );
}

export default Perfil;