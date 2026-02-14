import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW mock server instance used for testing and local development.
 *
 * @remarks
 * This server:
 * - registers all request handlers defined in `handlers.ts`
 * - intercepts network requests during tests or development
 * - provides predictable mock responses without requiring a real backend
 *
 * Typical usage:
 * - In test environments, call `server.listen()` before tests run.
 * - Call `server.resetHandlers()` between tests to avoid cross‑test pollution.
 * - Call `server.close()` after all tests complete.
 *
 * This module should be imported only once in your test setup file
 * (e.g., `setupTests.ts` or `vitest.setup.ts`).
 *
 * @returns A configured MSW server instance.
 */
export const server = setupServer(...handlers);
