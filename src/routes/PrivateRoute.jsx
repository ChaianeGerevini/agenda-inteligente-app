import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function PrivateRoute({children}) {

  const {
    usuario,
    loadingUser
  } = useUser();


  if (loadingUser) {

    return null;

  }
  if (!usuario) {
    return <Navigate to="/" replace />;
  }


  return children;
}