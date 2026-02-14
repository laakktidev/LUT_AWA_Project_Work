import { Navigate, Outlet } from "react-router-dom";

interface RequireAuthProps {
  /** Authentication token. If null, the user is considered unauthenticated. */
  token: string | null;
}

/**
 * Route guard that restricts access to authenticated users.
 *
 * @remarks
 * This component:
 * - checks whether a valid authentication token exists
 * - redirects unauthenticated users to the login page
 * - renders nested routes via `<Outlet />` when access is allowed
 *
 * It is typically used in your router configuration to protect private pages.
 *
 * @param token - Authentication token or null.
 *
 * @returns A redirect to `/login` when unauthenticated, otherwise an `<Outlet />`.
 */
export default function RequireAuth({ token }: RequireAuthProps) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
