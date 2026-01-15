import { Navigate, Outlet } from "react-router-dom";

interface RequireAuthProps {
  token: string | null;
}

export default function RequireAuth({ token }: RequireAuthProps) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
