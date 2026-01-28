import { test, expect } from "@playwright/test";

test("user can create a new document", async ({ page }) => {
  //
  // 1. STATE FOR MOCKED DOCUMENTS
  //
  let documents:string[] = [];

  //
  // 2. MOCK ALL BACKEND CALLS
  //

  // Login mock
  await page.route("**://localhost:8000/api/user/login", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-token",
        user: { id: 1, name: "Timo" },
      }),
    });
  });

  // Document list + create mocks
  await page.route("**://localhost:8000/api/document", async route => {
    const method = route.request().method();

    if (method === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(documents),
      });
      return;
    }

    if (method === "POST") {
      const newDoc = {
        id: "doc-1",
        title: "My first doc",
        content: "",
      };

      documents.push(newDoc);

      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(newDoc),
      });
      return;
    }
  });

  // Trash count mock
  await page.route("**://localhost:8000/api/document/trash/count", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 }),
    });
  });

  //
  // 3. LOGIN
  //
  await page.goto("http://localhost:3000/login");

  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("http://localhost:3000/");

  //
  // 4. CLICK NEW DOCUMENT
  //
  await page.getByRole("button", { name: "New" }).click();
  await expect(page).toHaveURL("http://localhost:3000/create");

  //
  // 5. FILL FORM
  //
  await page.getByPlaceholder("Document title").fill("My first doc");

  await page.getByRole("button", { name: "CREATE" }).click();

  //
  // 6. VERIFY DOCUMENT APPEARS IN LIST
  //
  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByText("My first doc")).toBeVisible();
});
