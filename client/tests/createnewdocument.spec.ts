import { test, expect } from "@playwright/test";

test("user can create a new document", async ({ page }) => {
  const mockUserId = "user-123";

  let documents = [];

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

  // GET + POST /api/document
  await page.route("**/api/document", async route => {
    const method = route.request().method();

    if (method === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents)
      });
      return;
    }

    if (method === "POST") {
      const newDoc = {
        _id: "doc-1",
        title: "My first doc",
        content: "",
        userId: mockUserId
      };

      documents.push(newDoc);

      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(newDoc)
      });
      return;
    }
  });

  // Trash count
  await page.route("**/api/document/trash/count", route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 })
    });
  });

  //
  // LOGIN
  //
  await page.goto("/login");
  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/");

  //
  // CREATE DOCUMENT
  //
  await page.getByRole("button", { name: "New" }).click();
  await expect(page).toHaveURL("/create");

  await page.getByPlaceholder("Document title").fill("My first doc");
  await page.getByRole("button", { name: "CREATE" }).click();

  //
  // VERIFY DOCUMENT APPEARS
  //
  await expect(page).toHaveURL("/");
  await expect(page.getByText("My first doc")).toBeVisible();
});
