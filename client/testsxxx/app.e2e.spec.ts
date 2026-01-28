import { test, expect } from "@playwright/test";
import { loginAsMockUser } from "./helpers/login";

// 1) User can log in successfully
test("user can log in successfully", async ({ page }) => {
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
});


// 2) User lands on dashboard after login
test("user lands on dashboard after login", async ({ page }) => {
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

  await page.route("**/api/document", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto("http://localhost:3000/login");

  await page.getByLabel("E-mail address").fill("timo@example.com");
  await page.getByLabel("Password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: /my documents/i })).toBeVisible();
});

// 3) User sees empty documents list
test("user sees empty documents list", async ({ page }) => {
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

  await page.route("**/api/document", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await loginAsMockUser(page);

  await expect(page.getByText(/no documents yet/i)).toBeVisible();
});

// 4) User can create a new document
test("user can create a new document", async ({ page }) => {
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

  await page.route("**/api/document", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    } else if (route.request().method() === "POST") {
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

  await loginAsMockUser(page);

  await page.getByRole("button", { name: /new document/i }).click();
  await page.getByLabel(/title/i).fill("My first doc");
  await page.getByRole("button", { name: /save/i }).click();

  await expect(page.getByText("My first doc")).toBeVisible();
});

// 5) User can edit an existing document
test("user can edit an existing document", async ({ page }) => {
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

  await page.route("**/api/document", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "doc-1", title: "My first doc", content: "Old content" },
        ]),
      });
    } else if (route.request().method() === "PUT") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "doc-1",
          title: "My first doc",
          content: "New content",
        }),
      });
    }
  });

  await loginAsMockUser(page);

  await page.getByText("My first doc").click();
  await page.getByRole("textbox").fill("New content");
  await page.getByRole("button", { name: /save/i }).click();

  await expect(page.getByText(/new content/i)).toBeVisible();
});

// 6) User can delete a document
test("user can delete a document", async ({ page }) => {
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

  await page.route("**/api/document", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "doc-1", title: "My first doc", content: "" },
        ]),
      });
    } else if (route.request().method() === "DELETE") {
      route.fulfill({
        status: 204,
        contentType: "application/json",
        body: "",
      });
    }
  });

  await loginAsMockUser(page);

  await page.getByText("My first doc").hover();
  await page.getByRole("button", { name: /delete/i }).click();
  await page.getByRole("button", { name: /confirm/i }).click();

  await expect(page.getByText("My first doc")).not.toBeVisible();
});

// 7) User can restore a document from trash
test("user can restore a document from trash", async ({ page }) => {
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

  await page.route("**/api/document/trash", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "doc-1", title: "My first doc", content: "" },
      ]),
    });
  });

  await page.route("**/api/document/doc-1/restore", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "doc-1",
        title: "My first doc",
        content: "",
      }),
    });
  });

  await page.route("**/api/document", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "doc-1", title: "My first doc", content: "" },
      ]),
    });
  });

  await loginAsMockUser(page);

  await page.getByRole("link", { name: /trash/i }).click();
  await page.getByText("My first doc").hover();
  await page.getByRole("button", { name: /restore/i }).click();

  await page.getByRole("link", { name: /my documents/i }).click();
  await expect(page.getByText("My first doc")).toBeVisible();
});

// 8) User can permanently delete a document from trash
test("user can permanently delete a document from trash", async ({ page }) => {
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

  await page.route("**/api/document/trash", async route => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "doc-1", title: "My first doc", content: "" },
        ]),
      });
    } else if (route.request().method() === "DELETE") {
      route.fulfill({
        status: 204,
        contentType: "application/json",
        body: "",
      });
    }
  });

  await loginAsMockUser(page);

  await page.getByRole("link", { name: /trash/i }).click();
  await page.getByText("My first doc").hover();
  await page.getByRole("button", { name: /delete forever/i }).click();
  await page.getByRole("button", { name: /confirm/i }).click();

  await expect(page.getByText("My first doc")).not.toBeVisible();
});

// 9) User can share a document
test("user can share a document", async ({ page }) => {
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

  await page.route("**/api/document", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "doc-1", title: "My first doc", content: "" },
      ]),
    });
  });

  await page.route("**/api/document/doc-1/share", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await loginAsMockUser(page);

  await page.getByText("My first doc").hover();
  await page.getByRole("button", { name: /share/i }).click();
  await page.getByLabel(/email/i).fill("friend@example.com");
  await page.getByRole("button", { name: /send invite/i }).click();

  await expect(page.getByText(/shared successfully/i)).toBeVisible();
});

// 10) Public document can be viewed without login
test("public document can be viewed without login", async ({ page }) => {
  await page.route("**/api/public/doc-1", async route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "doc-1",
        title: "Public doc",
        content: "Public content",
      }),
    });
  });

  await page.goto("http://localhost:3000/public/doc-1");

  await expect(page.getByText("Public doc")).toBeVisible();
  await expect(page.getByText("Public content")).toBeVisible();
  await expect(page.getByRole("button", { name: /save/i })).not.toBeVisible();
});
