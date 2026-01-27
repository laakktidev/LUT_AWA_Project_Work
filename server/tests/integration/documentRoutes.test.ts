import request from "supertest";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { User } from "../../src/models/User";
import { Document } from "../../src/models/Document";

describe("Document Routes", () => {

  let token: string;

  beforeAll(async () => {
    await connectTestDb();

    // Register user
    await request(app)
      .post("/api/user/register")
      .send({
        username: "timo",
        email: "timo@example.com",
        password: "StrongPass123!"
      });

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
  // CREATE DOCUMENT
  // ---------------------------
  test("POST /api/document creates a new document", async () => {
    const res = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My First Doc",
        content: "Hello world"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("My First Doc");
  });

  // ---------------------------
  // GET ALL DOCUMENTS
  // ---------------------------
  test("GET /api/document returns user's documents", async () => {
    // Create a document
    await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Doc A",
        content: "Content A"
      });

    const res = await request(app)
      .get("/api/document")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Doc A");
  });

  // ---------------------------
  // GET SINGLE DOCUMENT
  // ---------------------------
  test("GET /api/document/:id returns a single document", async () => {
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Doc B",
        content: "Content B"
      });

    const id = createRes.body.id;

    const res = await request(app)
      .get(`/api/document/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Doc B");
  });

  // ---------------------------
  // UPDATE DOCUMENT
  // ---------------------------
  test("PUT /api/document/:id updates a document", async () => {
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Original",
        content: "Original content"
      });

    const id = createRes.body.id;

    const res = await request(app)
      .put(`/api/document/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated",
        content: "Updated content"
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated");
  });

  // ---------------------------
  // DELETE DOCUMENT
  // ---------------------------
  test("DELETE /api/document/:id deletes a document", async () => {
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "To Delete",
        content: "Delete me"
      });

    const id = createRes.body.id;

    const res = await request(app)
      .delete(`/api/document/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

});
