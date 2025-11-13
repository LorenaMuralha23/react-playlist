import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { clearError, loginUser } from "../features/auth/authSlice";
import { isValidEmail, isValidPassword } from "../utils/validation";
import "../pages/css/LoginPage.css"
import { loadPlaylists } from "../features/playlist/playlistSlice";
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("userEmail", currentUser);
      dispatch(loadPlaylists(currentUser));
      navigate("/home");
    }
  }, [currentUser, dispatch, navigate]);

  return (
    <div className="spotify-login">
      <div className="login-container">
        <h1>Entrar</h1>

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
          Não tem conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}