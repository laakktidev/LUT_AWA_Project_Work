import mongoose from "mongoose";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";
import {
  softDeleteDocumentById,
  restoreDocumentById,
  permanentlyDeleteDocumentById,
  getTrashDocuments
} from "../../src/services/documentTrashService";

describe("documentTrashService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  test("softDeleteDocumentById marks document as deleted", async () => {
    const userId = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Trash me",
      content: "X",
      userId,
      isDeleted: false
    });

    const updated = await softDeleteDocumentById(doc._id.toString());

    expect(updated?.isDeleted).toBe(true);

    const found = await Document.findById(doc._id);
    expect(found?.isDeleted).toBe(true);
  });

  test("restoreDocumentById restores a soft-deleted document", async () => {
    const userId = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Restore me",
      content: "Y",
      userId,
      isDeleted: true
    });

    const updated = await restoreDocumentById(doc._id.toString());

    expect(updated?.isDeleted).toBe(false);

    const found = await Document.findById(doc._id);
    expect(found?.isDeleted).toBe(false);
  });

  test("permanentlyDeleteDocumentById removes the document", async () => {
    const userId = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Delete forever",
      content: "Z",
      userId,
      isDeleted: true
    });

    await permanentlyDeleteDocumentById(doc._id.toString());

    const found = await Document.findById(doc._id);
    expect(found).toBeNull();
  });

  test("getTrashDocuments returns only deleted documents", async () => {
    const userId = new mongoose.Types.ObjectId();

    await Document.create({
      title: "A",
      content: "X",
      userId,
      isDeleted: true
    });

    await Document.create({
      title: "B",
      content: "X",
      userId,
      isDeleted: false
    });

    const trashed = await getTrashDocuments(userId.toString());

    expect(trashed.length).toBe(1);
    expect(trashed[0].title).toBe("A");
    expect(trashed[0].isDeleted).toBe(true);
  });

});
