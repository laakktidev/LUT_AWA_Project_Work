import { jwtDecode } from "jwt-decode";

/* =======================================================
   CHECK IF JWT TOKEN IS EXPIRED
   ------------------------------------------------------- */
/**
 * Determines whether a JWT token is expired.
 *
 * @remarks
 * This function:
 * - decodes the JWT using `jwtDecode`
 * - checks the `exp` (expiration) claim
 * - treats tokens without an `exp` field as expired
 * - treats invalid or malformed tokens as expired
 *
 * The expiration time in a JWT is expressed in **seconds since Unix epoch**.
 *
 * @param token - The raw JWT string to validate.
 *
 * @returns `true` if the token is expired or invalid, otherwise `false`.
 *
 * @example
 * ```ts
 * if (isTokenExpired(token)) {
 *   logout();
 * }
 * ```
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);

    // If the token has no expiration field, treat it as expired
    if (!decoded.exp) {
      return true;
    }

    const nowInSeconds = Date.now() / 1000;
    return decoded.exp < nowInSeconds;
  } catch {
    // Invalid token → treat as expired
    return true;
  }
}
