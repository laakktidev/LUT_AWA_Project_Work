import { test, expect } from "@playwright/test";
import { loginAsMockUser } from "./helpers/login";

test("user can create a new document", async ({ page }) => {


   page.on("request", req => console.log("➡️", req.method(), req.url()));
   page.on("response", res => console.log("⬅️", res.status(), res.url()));


    // Mock login
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


    // Mock GET /api/document (initial list)
    await page.route("**/api/document", async route => {
        if (route.request().method() === "GET") {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([]),
            });
        }
    });

    // Mock POST /api/document (create)
    await page.route("**/api/document", async route => {
        if (route.request().method() === "POST") {
            route.fulfill({
                status: 201,
                contentType: "application/json",
                body: JSON.stringify({
                    id: "doc-1",
                    title: "My first doc",
                    content: "",
                }),
            });
        }
    });

    // Login
    await loginAsMockUser(page);

    
    console.log("URL after login:", page.url());
    console.log("=== BODY START ===");
    console.log(await page.locator("body").innerHTML());
    console.log("=== BODY END ===");
    
   
    // Click the "New" button
    await page.getByRole("button", { name: "New" }).click();

    // Fill the title field
    await page.getByLabel("Title").fill("My first doc");

    // Click Save
    await page.getByRole("button", { name: "Save" }).click();

    // After saving, the document should appear in the list
    await expect(page.getByText("My first doc")).toBeVisible();
});
