import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RedirectLanding() {
  const { code } = useParams();

  useEffect(() => {
    if (!code) return;

    window.location.href =
      `https://bqsh6c.mimo.run/index.html?ref=${code}`;
  }, [code]);

  return <p>Redirecionando...</p>;
}