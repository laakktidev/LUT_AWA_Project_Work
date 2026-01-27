import request from "supertest";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { User } from "../../src/models/User";
import { Document } from "../../src/models/Document";

describe("Document Trash Routes", () => {

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
  // SOFT DELETE
  // ---------------------------
  test("PATCH /api/document/:id/soft-delete moves document to trash", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Trash Doc",
        content: "To be deleted"
      });

    const id = createRes.body.id;

    const res = await request(app)
      .patch(`/api/document/${id}/soft-delete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Moved to trash");
    expect(res.body.doc).toHaveProperty("_id");
  });

  // ---------------------------
  // GET TRASH
  // ---------------------------
  test("GET /api/document/trash returns deleted documents", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Trash Doc",
        content: "To be deleted"
      });

    const id = createRes.body.id;

    // Soft delete
    await request(app)
      .patch(`/api/document/${id}/soft-delete`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get("/api/document/trash")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Trash Doc");
  });

  // ---------------------------
  // TRASH COUNT
  // ---------------------------
  test("GET /api/document/trash/count returns number of deleted documents", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Trash Doc",
        content: "To be deleted"
      });

    const id = createRes.body.id;

    // Soft delete
    await request(app)
      .patch(`/api/document/${id}/soft-delete`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get("/api/document/trash/count")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  // ---------------------------
  // RESTORE
  // ---------------------------
  test("PATCH /api/document/:id/restore restores a deleted document", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Restore Doc",
        content: "Restore me"
      });

    const id = createRes.body.id;

    // Soft delete
    await request(app)
      .patch(`/api/document/${id}/soft-delete`)
      .set("Authorization", `Bearer ${token}`);

    // Restore
    const res = await request(app)
      .patch(`/api/document/${id}/restore`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Restored");
    expect(res.body.doc).toHaveProperty("_id");
  });

  // ---------------------------
  // EMPTY TRASH
  // ---------------------------
  test("DELETE /api/document/trash/empty permanently deletes all trashed documents", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Delete Forever",
        content: "Bye"
      });

    const id = createRes.body.id;

    // Soft delete
    await request(app)
      .patch(`/api/document/${id}/soft-delete`)
      .set("Authorization", `Bearer ${token}`);

    // Empty trash
    const res = await request(app)
      .delete("/api/document/trash/empty")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Trash emptied");
    expect(res.body.deletedCount).toBe(1);
  });

});
