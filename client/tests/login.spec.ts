import { test, expect } from "@playwright/test";

test("user can log in successfully", async ({ page }) => {
  //
  // 1. MOCK BACKEND LOGIN ENDPOINT
  //
  await page.route("**://localhost:8000/api/user/login", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-token",
        user: { id: 1, name: "Timo" }
      })
    });
  });

  //
  // 2. MOCK DOCUMENT LIST + TRASH COUNT (REQUIRED BY DASHBOARD)
  //
  await page.route("**://localhost:8000/api/document", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]) // empty list for login test
      });
    }
  });

  await page.route("**://localhost:8000/api/document/trash/count", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 })
    });
  });

  //
  // 3. GO TO LOGIN PAGE
  //
  await page.goto("http://localhost:3000/login");

  //
  // 4. FILL LOGIN FORM (MATCHING REAL LABELS)
  //
  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");

  //
  // 5. SUBMIT FORM
  //
  await page.getByRole("button", { name: "Login" }).click();

  //
  // 6. VERIFY REDIRECT TO DASHBOARD
  //
  await expect(page).toHaveURL("http://localhost:3000/");

  //
  // 7. VERIFY USER SEES EMPTY DOCUMENT LIST
  //
  await expect(page.getByText("No documents found").or(page.getByText("New"))).toBeVisible();
});
