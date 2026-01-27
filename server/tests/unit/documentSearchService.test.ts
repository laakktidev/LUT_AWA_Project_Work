import mongoose from "mongoose";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";
import { searchDocumentsInDb } from "../../src/services/documentSearchService";

describe("documentSearchService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await Document.deleteMany({});
  });

  test("searchDocumentsInDb finds documents by title", async () => {
    const userId = new mongoose.Types.ObjectId();

    await Document.create({
      title: "My Shopping List",
      content: "Eggs, milk, bread",
      userId,
      isDeleted: false
    });

    await Document.create({
      title: "Workout Plan",
      content: "Pushups and squats",
      userId,
      isDeleted: false
    });

    const results = await searchDocumentsInDb(userId.toString(), "shopping");

    expect(results.length).toBe(1);
    expect(results[0].title).toBe("My Shopping List");
  });

  test("searchDocumentsInDb finds documents by content", async () => {
    const userId = new mongoose.Types.ObjectId();

    await Document.create({
      title: "Notes",
      content: "JavaScript closures explained",
      userId,
      isDeleted: false
    });

    const results = await searchDocumentsInDb(userId.toString(), "closures");

    expect(results.length).toBe(1);
    expect(results[0].content).toContain("closures");
  });

  test("searchDocumentsInDb is case-insensitive", async () => {
    const userId = new mongoose.Types.ObjectId();

    await Document.create({
      title: "Holiday Plans",
      content: "Visit Lapland",
      userId,
      isDeleted: false
    });

    const results = await searchDocumentsInDb(userId.toString(), "holiday");

    expect(results.length).toBe(1);
  });

  test("searchDocumentsInDb returns only user's documents", async () => {
    const userA = new mongoose.Types.ObjectId();
    const userB = new mongoose.Types.ObjectId();

    await Document.create({
      title: "A's Doc",
      content: "Hello",
      userId: userA,
      isDeleted: false
    });

    await Document.create({
      title: "B's Doc",
      content: "Hello",
      userId: userB,
      isDeleted: false
    });

    const results = await searchDocumentsInDb(userA.toString(), "hello");

    expect(results.length).toBe(1);
    expect(results[0].userId.toString()).toBe(userA.toString());
  });

  test("searchDocumentsInDb excludes deleted documents", async () => {
    const userId = new mongoose.Types.ObjectId();

    await Document.create({
      title: "Visible Doc",
      content: "Keep me",
      userId,
      isDeleted: false
    });

    await Document.create({
      title: "Deleted Doc",
      content: "Remove me",
      userId,
      isDeleted: true
    });

    const results = await searchDocumentsInDb(userId.toString(), "doc");

    expect(results.length).toBe(1);
    expect(results[0].title).toBe("Visible Doc");
  });

});
