import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { loginUser, clearError } from "./authSlice";
import { isValidEmail, isValidPassword } from "../../utils/validation";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (email && !isValidEmail(email)) setEmailError("Formato de e-mail inválido.");
    else setEmailError("");

    if (password && !isValidPassword(password))
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
    else setPasswordError("");
  }, [email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!isValidEmail(email)) return setEmailError("E-mail inválido.");
    if (!isValidPassword(password)) return setPasswordError("Senha muito curta.");

    dispatch(loginUser({ email, password }));
  };

  if (currentUser) {
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("lastLogin", new Date().toLocaleString());
    window.location.href = "/home";
  }

  return (
    <div className="spotify-login">
      <div className="login-container">
        <div className="login-header">
          <img src="https://img.icons8.com/?size=100&id=p6vT9rfwUGw6&format=png&color=000000" alt="Logo" className="login-logo" />
          <h1>Spotifinho</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            disabled={!!emailError || !!passwordError || !email || !password}
          >
            Entrar
          </button>
        </form>

        <p className="register">
          Não tem uma conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
