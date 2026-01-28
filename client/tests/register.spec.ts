import { test, expect } from "@playwright/test";

test("user can register successfully", async ({ page }) => {
  //
  // 1. MOCK BACKEND REGISTER ENDPOINT
  //
  await page.route("**://localhost:8000/api/user/register", async route => {
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        message: "User registered successfully",
        user: {
          id: "mock-user-id",
          email: "timo@example.com",
          username: "Timo"
        }
      })
    });
  });

  //
  // 2. GO TO SIGNUP PAGE
  //
  await page.goto("http://localhost:3000/signup");

  //
  // 3. FILL REGISTRATION FORM (MATCHING REAL LABELS)
  //
  await page.getByLabel("Username").fill("Timo");
  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");

  //
  // 4. SUBMIT FORM
  //
  await page.getByRole("button", { name: "Sign Up" }).click();

  //
  // 5. VERIFY SUCCESS TOAST BEFORE REDIRECT
  //
  await expect(page.getByText("Registration successful!")).toBeVisible();

  //
  // 6. VERIFY REDIRECT TO LOGIN PAGE
  //
  await expect(page).toHaveURL("http://localhost:3000/login");
});
