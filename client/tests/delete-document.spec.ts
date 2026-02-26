import { test, expect } from "@playwright/test";

test("user can delete a document", async ({ page }) => {
  const mockUserId = "user-123";

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
  // MOCK ALL API ROUTES
  //

  // Login
  await page.route("**/api/user/login", route => {
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
  await page.route("**/api/user/me", route => {
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

  // GET /api/document (list)
  await page.route("**/api/document", route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents)
      });
    }
  });

  // GET /api/document/trash/count
  await page.route("**/api/document/trash/count", route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 })
    });
  });

  // PATCH /api/document/doc-1/soft-delete
  await page.route("**/api/document/doc-1/soft-delete", route => {
    documents = []; // remove the document
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true })
    });
  });

  //
  // LOGIN
  //
  await page.goto("/login");
  await page.getByLabel(/mail/i).fill("timo@example.com");
  await page.getByLabel(/password/i).fill("StrongPass123!");
  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL("/");

  //
  // VERIFY DOCUMENT IS VISIBLE
  //
  await expect(page.getByText("Delete Me")).toBeVisible();

  //
  // DELETE DOCUMENT
  //
  await page.getByLabel("Delete").click();

  //
  // VERIFY DOCUMENT DISAPPEARS
  //
  await expect(page.getByText("Delete Me")).not.toBeVisible();
});
