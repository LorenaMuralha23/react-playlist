// src/routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const sessionUser = sessionStorage.getItem("userEmail");

  if (!currentUser && !sessionUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}