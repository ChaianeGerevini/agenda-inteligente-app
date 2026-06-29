import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../services/firebase";

export default function Referral() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      // só redireciona com parâmetro
      navigate(`/login?ref=${code}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [code, navigate]);

  return <p>Redirecionando...</p>;
}