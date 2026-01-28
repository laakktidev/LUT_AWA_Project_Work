import { test, expect } from "@playwright/test";

test("user can delete a document", async ({ page }) => {
  const mockUserId = "user-123";

  // Debugging helpers
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));
  page.on("console", msg => msg.type() === "error" && console.log("CONSOLE ERROR:", msg.text()));
  page.on("request", req => console.log("REQ:", req.method(), req.url()));

  // Initial list
  let documents = [
    {
      _id: "doc-1",
      title: "Delete Me",
      content: "<p>Some content</p>",
      userId: mockUserId,
      editors: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: "document"
    }
  ];

  //
  // MOCK ROUTES
  //

  // Login
  await page.route("**/api/user/login**", route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-token",
        user: { id: mockUserId, name: "Timo" }
      })
    });
  });

  // /api/user/me
  await page.route("**/api/user/me**", route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: mockUserId,
        name: "Timo",
        email: "timo@example.com"
      })
    });
  });

  // GET /api/document (list) — must match ALL variations
  await page.route("**/api/document**", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents)
      });
    }
  });

  // GET /api/document/trash/count — required because your delete handler calls refreshTrashCount()
  await page.route("**/api/document/trash/count**", route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 })
    });
  });

  // DELETE /api/document/doc-1
  await page.route("**/api/document/doc-1/soft-delete**", route => {
  if (route.request().method() === "PATCH") {
    documents = []; // remove the document
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true })
    });
  }
});


  // LOGIN
  await page.goto("http://localhost:3000/login");
  await page.getByLabel(/mail/i).fill("timo@example.com");
  await page.getByLabel(/password/i).fill("StrongPass123!");
  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL("http://localhost:3000/");

  // VERIFY DOCUMENT IS VISIBLE
  await expect(page.getByText("Delete Me")).toBeVisible();

  // CLICK DELETE BUTTON
  await page.getByLabel("Delete").click();

  // WAIT FOR THE LIST TO REFETCH
  await page.waitForResponse(res =>
    res.url().includes("/api/document") && res.request().method() === "GET"
  );

  // VERIFY DOCUMENT DISAPPEARS
  await expect(page.getByText("Delete Me")).not.toBeVisible();
});
