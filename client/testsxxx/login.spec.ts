import { test, expect } from "@playwright/test";

test("user can log in successfully", async ({ page }) => {
  // 1) Mock the login API
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

  // 2) Go to login page
  await page.goto("http://localhost:3000/login");

  // 3) Fill form
  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");

  // 4) Submit
  await page.getByRole("button", { name: /login/i }).click();

  // 5) Expect redirect
  await expect(page).toHaveURL("http://localhost:3000/");
});

