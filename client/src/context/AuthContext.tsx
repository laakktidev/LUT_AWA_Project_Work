import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/User";
import { isTokenExpired } from "../utils/isTokenExpired";

interface AuthContextType {
  /** The current authentication token, or null if not logged in. */
  token: string | null;

  /** The authenticated user object, or null if not logged in. */
  user: User | null;

  /** Whether the initial session restoration is still in progress. */
  loading: boolean;

  /**
   * Logs the user in.
   *
   * @param token - JWT token returned by the backend.
   * @param user - User object returned by the backend.
   */
  login: (token: string, user: User) => void;

  /**
   * Logs the user out and clears all stored authentication data.
   */
  logout: () => void;

  /**
   * Updates the stored user object and persists it to localStorage.
   *
   * @param updated - Updated user object.
   */
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and actions to the application.
 *
 * @remarks
 * This provider:
 * - restores the session from `localStorage` on page load
 * - automatically removes expired tokens
 * - exposes `login`, `logout`, and `updateUser` helpers
 * - sets `loading` to `false` once the initial session check completes
 *
 * Wrap your entire app with `<AuthProvider>` to enable `useAuth()`.
 *
 * @param children - React children that should have access to auth context.
 * @returns Auth context provider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /** Stored JWT token. */
  const [token, setToken] = useState<string | null>(null);

  /** Stored user object. */
  const [user, setUser] = useState<User | null>(null);

  /** Whether the initial session restoration is still running. */
  const [loading, setLoading] = useState(true);

  /**
   * Restores the session from localStorage on page load.
   *
   * @remarks
   * - Removes expired tokens.
   * - Loads user data if available.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || isTokenExpired(savedToken)) {
      // No token or expired token → ensure clean state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    // Token exists and is valid
    setToken(savedToken);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Updates the stored user object and persists it to localStorage.
   *
   * @param updated - Updated user object.
   */
  function updateUser(updated: User) {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  }

  /**
   * Logs the user in and persists token + user to localStorage.
   *
   * @param newToken - JWT token returned by the backend.
   * @param newUser - User object returned by the backend.
   */
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  /**
   * Logs the user out and clears all persisted auth data.
   */
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access the authentication context.
 *
 * @remarks
 * Must be used inside `<AuthProvider>`.  
 * Throws an error if called outside the provider.
 *
 * @returns The current authentication context.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
