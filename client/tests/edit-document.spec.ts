import { test, expect } from "@playwright/test";

test("user can edit an existing document", async ({ page }) => {
  const mockUserId = "user-123";

  let documents = [
    {
      _id: "doc-1",
      title: "Original Title",
      content: "<p>Initial content</p>",
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

  // GET /api/document
  await page.route("**/api/document", route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents)
      });
    }
  });

  // GET + PUT /api/document/doc-1
  await page.route("**/api/document/doc-1", route => {
    const method = route.request().method();

    if (method === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents[0])
      });
      return;
    }

    if (method === "PUT") {
      const updated = {
        ...documents[0],
        title: "Updated Title"
      };
      documents[0] = updated;

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(updated)
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
  await page.getByLabel(/mail/i).fill("timo@example.com");
  await page.getByLabel(/password/i).fill("StrongPass123!");
  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL("/");

  //
  // OPEN DOCUMENT
  //
  await page.getByRole("heading", { name: "Original Title" }).click();
  await expect(page).toHaveURL("/view/doc-1");

  //
  // EDIT DOCUMENT
  //
  await page.getByLabel("Edit").click();
  await expect(page).toHaveURL("/edit/doc-1");

  await page.getByPlaceholder("Document title").fill("Updated Title");
  await page.getByRole("button", { name: "SAVE" }).click();

  //
  // VERIFY UPDATED TITLE
  //
  await expect(page).toHaveURL("/");
  await expect(page.getByText("Updated Title")).toBeVisible();
});
