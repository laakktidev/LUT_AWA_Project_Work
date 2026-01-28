import { Page, expect } from "@playwright/test";

export async function loginAsMockUser(page: Page) {
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

  await page.goto("http://localhost:3000/login");

  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("http://localhost:3000/");
}
