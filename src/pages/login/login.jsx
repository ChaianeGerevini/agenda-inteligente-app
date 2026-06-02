 // Login//
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../services/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function cadastrar() {
    try {
      const usuario = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      alert("Usuário criado com sucesso!");
      console.log(usuario.user);

    } catch (erro) {
      console.error(erro);
      alert(erro.message);
    }
  }

  async function entrar() {
    try {
      const usuario = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      navigate("/dashboard");
      console.log(usuario.user);

    } catch (erro) {
      console.error(erro);
      alert(erro.code);
    }
  }

  return (
    <div>
      <h1>Agenda Inteligente</h1>

      <br />

      <input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <br />
      <br />
         
      <button onClick={entrar}>
        Entrar
      </button>

      <br />
      <br />

      <button onClick={cadastrar}>
        Criar Conta
      </button>
    </div>
  );
}

export default Login;
