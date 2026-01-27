import mongoose from "mongoose";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";
import {
  getDocumentForSharing,
  addEditorsToDocument,
  updatePublicVisibilityInDb
} from "../../src/services/documentShareService";

describe("documentShareService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  test("getDocumentForSharing returns document only if user is owner", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUser = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Doc",
      content: "X",
      userId: ownerId,
      editors: [],
      isPublic: false
    });

    const foundByOwner = await getDocumentForSharing(doc._id.toString(), ownerId.toString());
    expect(foundByOwner).not.toBeNull();

    const foundByOther = await getDocumentForSharing(doc._id.toString(), otherUser.toString());
    expect(foundByOther).toBeNull();
  });

  test("addEditorsToDocument adds editors without duplicates", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const editorA = new mongoose.Types.ObjectId();
    const editorB = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Doc",
      content: "X",
      userId: ownerId,
      editors: [editorA]
    });

    const updated = await addEditorsToDocument(
      doc._id.toString(),
      [editorA.toString(), editorB.toString()]
    );

    const editorIds = updated!.editors.map(id => id.toString());

    expect(editorIds.length).toBe(2);
    expect(editorIds).toContain(editorA.toString());
    expect(editorIds).toContain(editorB.toString());
  });

  test("updatePublicVisibilityInDb updates visibility only for owner", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUser = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Doc",
      content: "X",
      userId: ownerId,
      isPublic: false
    });

    // Owner can update
    const updatedByOwner = await updatePublicVisibilityInDb(
      doc._id.toString(),
      ownerId.toString(),
      true
    );

    expect(updatedByOwner!.isPublic).toBe(true);

    // Non-owner cannot update
    const updatedByOther = await updatePublicVisibilityInDb(
      doc._id.toString(),
      otherUser.toString(),
      false
    );

    expect(updatedByOther).toBeNull();
  });

});
