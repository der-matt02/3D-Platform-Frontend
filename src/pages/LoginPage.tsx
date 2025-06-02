// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.detail || "Usuario o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      const data = await res.json(); // { access_token, token_type }
      const token = data.access_token;
      // En lugar de guardar aquí en localStorage, llamamos onLogin
      onLogin(token);
      navigate("/quotes");
    } catch (err) {
      console.error(err);
      setError("Error de conexión al iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Usuario o Email:</label>
          <br />
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Contraseña:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "6px 12px" }}
        >
          {loading ? "Validando..." : "Iniciar sesión"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default LoginPage;
