import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function PrivateRoute({ children }) {

  const { usuario, loadingUser } = useUser();


  if (loadingUser) {
    return (
      <div>
        Carregando Agendly...
      </div>
    );
  }


  if (!usuario) {
    return <Navigate to="/" replace />;
  }


  return children;
}