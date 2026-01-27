import request from "supertest";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { User } from "../../src/models/User";
import { Document } from "../../src/models/Document";

describe("Document Sharing Routes", () => {

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
    await User.deleteMany({ email: { $ne: "timo@example.com" } });
  });

  // ---------------------------
  // UPDATE EDITORS
  // ---------------------------
  test("PATCH /api/document/:id/editors updates editors list", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Share Doc",
        content: "Content"
      });

    const docId = createRes.body.id;

    // Create another user to add as editor
    const otherUserRes = await request(app)
      .post("/api/user/register")
      .send({
        username: "editorUser",
        email: "editor@example.com",
        password: "StrongPass123!"
      });

    const editorUserId = otherUserRes.body.user.id;

    const res = await request(app)
      .patch(`/api/document/${docId}/editors`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userIds: [editorUserId]
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Editors updated");
  });

  // ---------------------------
  // UPDATE PUBLIC VISIBILITY
  // ---------------------------
  test("PATCH /api/document/:id/public updates public visibility", async () => {
    // Create document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Public Doc",
        content: "Content"
      });

    const docId = createRes.body.id;

    const res = await request(app)
      .patch(`/api/document/${docId}/public`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        isPublic: true
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Visibility updated");
    expect(res.body.isPublic).toBe(true);
  });

});
