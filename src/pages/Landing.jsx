import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RedirectLanding() {
  const { code } = useParams();

  useEffect(() => {
    // salva referral (opcional)
    localStorage.setItem("referral", code);

    // SEMPRE manda pra landing externa
    window.location.href =
      `https://bqsh6c.mimo.run/index.html?ref=${code}`;
  }, [code]);

  return <p>Redirecionando...</p>;
}