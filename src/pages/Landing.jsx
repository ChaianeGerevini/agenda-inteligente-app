import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Landing() {
  const { code } = useParams();

  useEffect(() => {
    if (code) {
      localStorage.setItem("referral", code);
    }

    window.location.replace("https://bqsh6c.mimo.run/index.html");
  }, [code]);

  return <p>Redirecionando...</p>;
}