import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "./authSlice";
import type { RootState } from "../../app/store";
import "./LoginPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((s: RootState) => s.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(registerUser({ email, password }));
  };

  if (currentUser) {
    window.location.href = "/home";
  }

  return (
    <div className="spotify-login">
      <div className="login-container">
        <h1>Crie sua conta Pinkify</h1>

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
          <button type="submit">Cadastrar</button>
        </form>

        <p className="register">
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
}
