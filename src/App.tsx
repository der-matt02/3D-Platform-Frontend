// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import QuotePage from "./pages/QuotePage";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  // Al montar, leemos token de localStorage (si existe)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Función que le pasaremos a LoginPage para actualizar el token en App
  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/quotes" replace /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/register"
          element={token ? <Navigate to="/quotes" replace /> : <RegisterPage />}
        />

        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/quotes" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/quotes"
          element={
            <ProtectedRoute>
              <QuotePage token={token!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            token ? <Navigate to="/quotes" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
