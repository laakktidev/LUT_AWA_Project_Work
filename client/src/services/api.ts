import axios from "axios";
import { isTokenExpired } from "../utils/isTokenExpired";

/**
 * Preconfigured Axios instance for all API requests.
 *
 * @remarks
 * This instance:
 * - uses a fixed `baseURL` for all requests
 * - automatically attaches a valid JWT token to outgoing requests
 * - supports a global 401 handler via `attachAuthInterceptor`
 *
 * The token is read from `localStorage` on each request, ensuring the latest
 * authentication state is always used.
 */
const api = axios.create({
  baseURL: "http://localhost:3000",
});

/**
 * Request interceptor that attaches the `Authorization` header.
 *
 * @remarks
 * - Reads the token from `localStorage`.
 * - Validates the token using `isTokenExpired`.
 * - Adds `Authorization: Bearer <token>` only when the token is valid.
 *
 * This ensures all authenticated endpoints automatically receive the token.
 *
 * @param config - Axios request configuration.
 * @returns The updated request configuration.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Attaches a global response interceptor that handles authentication failures.
 *
 * @remarks
 * - When a `401 Unauthorized` response is detected, the provided `logout`
 *   callback is executed.
 * - This allows the application to automatically clear auth state and redirect
 *   the user when their session expires.
 *
 * This function should be called once during application startup.
 *
 * @param logout - Callback that clears authentication state and localStorage.
 *
 * @example
 * ```ts
 * // In your App.tsx or main.tsx:
 * attachAuthInterceptor(() => logout());
 * ```
 *
 * @returns void
 */
export function attachAuthInterceptor(logout: () => void) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
}

export default api;
