import mongoose from "mongoose";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";
import { cloneDocumentInDb } from "../../src/services/documentCloneService";

describe("documentCloneService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  test("cloneDocumentInDb creates a new document with copied content", async () => {
    const userId = new mongoose.Types.ObjectId();

    const original = await Document.create({
      title: "Original Title",
      content: "Original content",
      userId,
      lock: {
        isLocked: false,
        lockedBy: null
      },
      isDeleted: false
    });

    const clone = await cloneDocumentInDb(original, userId.toString());

    // Ensure a new document was created
    expect(clone._id.toString()).not.toBe(original._id.toString());

    // Ensure content was copied
    expect(clone.content).toBe(original.content);

    // Ensure title was modified (depends on your implementation)
    expect(clone.title).not.toBe(original.title);
    expect(clone.title.toLowerCase()).toContain("original");

    // Ensure same user
    expect(clone.userId.toString()).toBe(userId.toString());

    // Ensure clone is not locked or deleted
    expect(clone.lock.isLocked).toBe(false);
    expect(clone.lock.lockedBy).toBeNull();
    expect(clone.isDeleted).toBe(false);
  });

});
