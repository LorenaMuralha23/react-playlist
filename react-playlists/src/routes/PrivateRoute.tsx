// src/routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Tenta validar o login tanto pelo Redux quanto pelo sessionStorage
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const sessionUser = sessionStorage.getItem("userEmail");

  if (currentUser || sessionUser) {
    return children;
  }

  // Se não estiver logado, redireciona para /login
  return <Navigate to="/login" replace />;
}
