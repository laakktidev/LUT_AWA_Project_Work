import { http, HttpResponse } from "msw";

/**
 * Shape of the login request body used in MSW mocks.
 *
 * @remarks
 * This interface describes the expected structure of the JSON body
 * sent to the mocked `/api/user/login` endpoint.
 */
interface LoginRequestBody {
  /** Email address provided by the user. */
  email?: string;

  /** Password provided by the user. */
  password?: string;
}

/**
 * Collection of MSW request handlers used for mocking API endpoints.
 *
 * @remarks
 * These handlers simulate backend behavior during development and testing.
 * They allow the frontend to run without a real server by returning predictable
 * mock responses for authentication and document fetching.
 *
 * The handlers include:
 * - a mocked login endpoint
 * - a mocked document‑by‑ID endpoint
 *
 * Import this array into your MSW setup file (e.g., `setupTests.ts` or `browser.ts`)
 * and pass it to `setupWorker(...handlers)` or `setupServer(...handlers)`.
 */
export const handlers = [
  /**
   * Mocks the login endpoint.
   *
   * @remarks
   * - Returns a 401 error if the email is `"wrong@example.com"`.
   * - Otherwise returns a mock token and user object.
   *
   * @param request - Incoming HTTP request containing login credentials.
   * @returns A mocked JSON response simulating login success or failure.
   */
  http.post("/api/user/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;

    if (body?.email === "wrong@example.com") {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: "mock-token",
      user: { id: "1", username: "timo" }
    });
  }),

  /**
   * Mocks fetching a document by ID.
   *
   * @remarks
   * Always returns a simple mocked document with the requested ID.
   *
   * @param params - Route parameters containing the document ID.
   * @returns A mocked JSON response containing a fake document.
   */
  http.get("/api/document/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: "Mocked Doc",
      content: "Hello from MSW"
    });
  }),
];
