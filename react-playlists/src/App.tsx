import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage"; // 🔹 nova importação
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nova rota de detalhes da playlist */}
        <Route
          path="/playlists/:id"
          element={
            <PrivateRoute>
              <PlaylistDetailPage />
            </PrivateRoute>
          }
        />

        {/* Rota padrão */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
