import mongoose from "mongoose";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";
import {
  createDocumentInDb,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  getAllDocumentsForUser
} from "../../src/services/documentService";

describe("documentService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  test("createDocumentInDb creates a new document", async () => {
    const userId = new mongoose.Types.ObjectId();

    const doc = await createDocumentInDb({
      title: "My Title",
      content: "Hello world",
      userId
    });

    expect(doc.title).toBe("My Title");
    expect(doc.content).toBe("Hello world");
    expect(doc.userId.toString()).toBe(userId.toString());
  });

  test("getDocumentById returns the correct document", async () => {
    const userId = new mongoose.Types.ObjectId();

    const created = await createDocumentInDb({
      title: "Doc A",
      content: "Content A",
      userId
    });

    const found = await getDocumentById(created._id.toString());

    expect(found?.title).toBe("Doc A");
    expect(found?.content).toBe("Content A");
  });

  test("updateDocumentById updates fields correctly", async () => {
    const userId = new mongoose.Types.ObjectId();

    const created = await createDocumentInDb({
      title: "Old",
      content: "Old content",
      userId
    });

    const updated = await updateDocumentById(created._id.toString(), {
      title: "New",
      content: "New content"
    });

    expect(updated?.title).toBe("New");
    expect(updated?.content).toBe("New content");
  });

  test("deleteDocumentById removes the document", async () => {
    const userId = new mongoose.Types.ObjectId();

    const created = await createDocumentInDb({
      title: "To Delete",
      content: "X",
      userId
    });

    await deleteDocumentById(created._id.toString());

    const found = await getDocumentById(created._id.toString());
    expect(found).toBeNull();
  });

  test("getAllDocumentsForUser returns only user's documents", async () => {
    const userA = new mongoose.Types.ObjectId();
    const userB = new mongoose.Types.ObjectId();

    await createDocumentInDb({ title: "A1", content: "X", userId: userA });
    await createDocumentInDb({ title: "A2", content: "X", userId: userA });
    await createDocumentInDb({ title: "B1", content: "X", userId: userB });

    const docs = await getAllDocumentsForUser(userA.toString());

    expect(docs.length).toBe(2);
    expect(docs.every(d => d.userId.toString() === userA.toString())).toBe(true);
  });

});
