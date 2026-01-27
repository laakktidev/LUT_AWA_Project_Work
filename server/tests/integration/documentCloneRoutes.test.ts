import request from "supertest";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";

describe("Document Clone Route", () => {

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
  // CLONE DOCUMENT
  // ---------------------------
  test("POST /api/document/:id/clone clones a document", async () => {
    // Create original document
    const createRes = await request(app)
      .post("/api/document")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Original Doc",
        content: "Original content"
      });

    const originalId = createRes.body.id;

    // Clone it
    const cloneRes = await request(app)
      .post(`/api/document/${originalId}/clone`)
      .set("Authorization", `Bearer ${token}`);

    expect(cloneRes.status).toBe(201);

    const clone = cloneRes.body;

    // Validate clone structure
    expect(clone).toHaveProperty("_id");
    expect(clone._id).not.toBe(originalId);

    expect(clone.title).toBe("Original Doc (Copy)");
    expect(clone.content).toBe("Original content");


    // Validate ownership
    expect(clone.userId).toBe(userId);

    // Validate clone is not deleted
    expect(clone.isDeleted).toBe(false);
  });

});
