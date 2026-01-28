import { test, expect } from "@playwright/test";

test("user can edit an existing document", async ({ page }) => {
  const mockUserId = "user-123";

  // Capture React crashes
  page.on("pageerror", err => {
    console.log("PAGE ERROR:", err.message);
  });

  // Capture console errors
  page.on("console", msg => {
    if (msg.type() === "error") {
      console.log("CONSOLE ERROR:", msg.text());
    }
  });

  // Log all requests
  page.on("request", req => console.log("REQUEST:", req.url()));

  // Mock document
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
      type: "document",
      sharedWith: [],
      ownerName: "Timo",
      ownerEmail: "timo@example.com",
      visibility: "private"
    }
  ];

  //
  // MOCK API ROUTES
  //
  await page.route("**/api/user/login**", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-token",
        user: { id: mockUserId, name: "Timo" }
      })
    });
  });

  await page.route("**/api/user/me**", async route => {
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

  // IMPORTANT: match ALL variations of /api/document
  await page.route("**/api/document**", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents)
      });
    }
  });

  await page.route("**/api/document/trash/count**", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 })
    });
  });

  await page.route("**/api/document/doc-1**", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents[0])
      });
    }
    if (route.request().method() === "PUT") {
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
    }
  });

  //
  // LOGIN FLOW
  //
  await page.goto("http://localhost:3000/login");

  // Use robust selectors
  await page.getByLabel(/mail/i).fill("timo@example.com");
  await page.getByLabel(/password/i).fill("StrongPass123!");
  await page.getByRole("button", { name: /login/i }).click();

  // Wait for redirect
  await expect(page).toHaveURL("http://localhost:3000/");

  // Wait for list page to stabilize
  await page.waitForSelector("h6:has-text('Original Title')");

  //
  // OPEN DETAILS PAGE
  //
  // Click the title itself (never detaches)
  await page.getByRole("heading", { name: "Original Title" }).click();

  // Confirm navigation
  await expect(page).toHaveURL("http://localhost:3000/view/doc-1");

  //
  // CLICK EDIT BUTTON
  //
  await page.getByLabel("Edit").click();

  await expect(page).toHaveURL("http://localhost:3000/edit/doc-1");

  //
  // EDIT TITLE
  //
  await page.getByPlaceholder("Document title").fill("Updated Title");

  //
  // SAVE
  //
  await page.getByRole("button", { name: "SAVE" }).click();

  // Back to list
  await expect(page).toHaveURL("http://localhost:3000/");

  //
  // VERIFY UPDATED TITLE
  //
  await expect(page.getByText("Updated Title")).toBeVisible();
});
