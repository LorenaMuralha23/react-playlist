import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { loginUser, clearError } from "./authSlice";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  if (currentUser) {
    window.location.href = "/home";
  }

  return (
    <div className="spotify-login">
      <div className="login-container">
        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968898.png"
            alt="Logo"
            className="login-logo"
          />
          <h1>Pinkify</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>

        <p className="register">
          Não tem uma conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
