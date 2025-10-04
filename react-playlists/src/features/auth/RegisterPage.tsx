import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "./authSlice";
import { isValidEmail, isValidPassword } from "../../utils/validation";
import "./LoginPage.css"; // pode reutilizar o CSS

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (email && !isValidEmail(email)) setEmailError("Formato de e-mail inválido.");
    else setEmailError("");

    if (password && !isValidPassword(password))
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
    else setPasswordError("");

    if (confirmPassword && confirmPassword !== password)
      setConfirmError("As senhas não coincidem.");
    else setConfirmError("");
  }, [email, password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) return setEmailError("E-mail inválido.");
    if (!isValidPassword(password)) return setPasswordError("Senha muito curta.");
    if (confirmPassword !== password) return setConfirmError("Senhas diferentes.");

    dispatch(registerUser({ email, password }));
  };

  return (
    <div className="spotify-login">
      <div className="login-container">
        <h1>Criar conta</h1>

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

          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmError && <p className="error">{confirmError}</p>}

          <button
            type="submit"
            disabled={
              !!emailError ||
              !!passwordError ||
              !!confirmError ||
              !email ||
              !password ||
              !confirmPassword
            }
          >
            Cadastrar
          </button>
        </form>

        <p className="register">
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
}
