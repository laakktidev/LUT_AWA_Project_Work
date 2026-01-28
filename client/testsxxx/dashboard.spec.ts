import { test, expect } from "@playwright/test";

test("user lands on documents list after login", async ({ page }) => {
  // 1) Mock login API
  await page.route("**/api/user/login", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-token",
        user: { id: 1, name: "Timo" },
      }),
    });
  });

  // 2) Mock documents list
  await page.route("**/api/document", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  // 3) Mock trash count
  await page.route("**/api/document/trash/count", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0 }),
    });
  });

  // 4) Go to login page
  await page.goto("http://localhost:3000/login");

  // 5) Fill login form
  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");

  // 6) Submit
  await page.getByRole("button", { name: /login/i }).click();

  // 7) Expect redirect
  await expect(page).toHaveURL("http://localhost:3000/");

  // 8) Expect dashboard heading
  await expect(
    page.getByRole("heading", { name: /my documents/i })
  ).toBeVisible();
});
