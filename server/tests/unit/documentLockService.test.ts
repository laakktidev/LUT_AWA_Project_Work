import mongoose from "mongoose";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";
import {
  lockDocumentInDb,
  unlockDocumentInDb
} from "../../src/services/documentLockService";

describe("documentLockService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  test("lockDocumentInDb sets lock.isLocked and lock.lockedBy", async () => {
    const userId = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Lock me",
      content: "X",
      userId,
      lock: {
        isLocked: false,
        lockedBy: null
      }
    });

    const updated = await lockDocumentInDb(doc._id.toString(), userId.toString());

    expect(updated?.lock.isLocked).toBe(true);
    expect(updated?.lock.lockedBy?.toString()).toBe(userId.toString());

    const found = await Document.findById(doc._id);
    expect(found?.lock.isLocked).toBe(true);
    expect(found?.lock.lockedBy?.toString()).toBe(userId.toString());
  });

  test("unlockDocumentInDb clears lock.isLocked and lock.lockedBy", async () => {
    const userId = new mongoose.Types.ObjectId();

    const doc = await Document.create({
      title: "Unlock me",
      content: "Y",
      userId,
      lock: {
        isLocked: true,
        lockedBy: userId
      }
    });

    const updated = await unlockDocumentInDb(doc._id.toString());

    expect(updated?.lock.isLocked).toBe(false);
    expect(updated?.lock.lockedBy).toBeNull();

    const found = await Document.findById(doc._id);
    expect(found?.lock.isLocked).toBe(false);
    expect(found?.lock.lockedBy).toBeNull();
  });

});
