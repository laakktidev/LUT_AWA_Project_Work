import { http, HttpResponse } from "msw";

export const handlers = [
  // Example: login
  http.post("/api/user/login", async ({ request }) => {
    const body = await request.json();

    if (body.email === "wrong@example.com") {
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return HttpResponse.json({
      token: "mock-token",
      user: { id: "1", username: "timo" }
    });
  }),

  // Example: fetch a document
  http.get("/api/document/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: "Mocked Doc",
      content: "Hello from MSW"
    });
  }),
];
