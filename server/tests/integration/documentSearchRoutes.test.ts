import request from "supertest";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";

describe("Document Search Route", () => {

  let token: string;
  let userId: string;

  beforeAll(async () => {
    await connectTestDb();

    // Register user
    const registerRes = await request(app)
      .post("/api/user/register")
      .send({
        username: "timo",
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    userId = registerRes.body.user.id;

    // Login user
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  // ---------------------------
  // SEARCH BY TITLE
  // ---------------------------
  test("GET /api/document/search finds documents by title", async () => {
    await Document.create({
      title: "Machine Learning Notes",
      content: "Regression, MMSE, Overfitting",
      userId,
      isDeleted: false
    });

    await Document.create({
      title: "Grocery List",
      content: "Milk, eggs",
      userId,
      isDeleted: false
    });

    const res = await request(app)
      .get("/api/document/search?q=machine")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Machine Learning Notes");
  });

  // ---------------------------
  // SEARCH BY CONTENT
  // ---------------------------
  test("GET /api/document/search finds documents by content", async () => {
    await Document.create({
      title: "Random Doc",
      content: "This contains regression formulas",
      userId,
      isDeleted: false
    });

    const res = await request(app)
      .get("/api/document/search?q=regression")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].content).toContain("regression");
  });

  // ---------------------------
  // IGNORES DELETED DOCUMENTS
  // ---------------------------
  test("GET /api/document/search does not return deleted documents", async () => {
    await Document.create({
      title: "Visible Doc",
      content: "Hello",
      userId,
      isDeleted: false
    });

    await Document.create({
      title: "Deleted Doc",
      content: "Should not appear",
      userId,
      isDeleted: true
    });

    const res = await request(app)
      .get("/api/document/search?q=doc")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Visible Doc");
  });

  // ---------------------------
  // EMPTY RESULTS
  // ---------------------------
  test("GET /api/document/search returns empty array when no matches", async () => {
    await Document.create({
      title: "Something else",
      content: "Nothing relevant",
      userId,
      isDeleted: false
    });

    const res = await request(app)
      .get("/api/document/search?q=xyz123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

});
