import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { User } from "../../src/models/User";

describe("User Routes", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  // ---------------------------
  // REGISTER
  // ---------------------------
  test("POST /api/user/register registers a new user", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "timo",
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.user.email).toBe("timo@example.com");
  });

  // ---------------------------
  // LOGIN
  // ---------------------------
  test("POST /api/user/login logs in a user", async () => {
    // Register first
    await request(app)
      .post("/api/user/register")
      .send({
        username: "timo",
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("timo@example.com");
  });

  // ---------------------------
  // LIST USERS (AUTH REQUIRED)
  // ---------------------------
  test("GET /api/user/ returns list of users when authenticated", async () => {
    // Register
    await request(app)
      .post("/api/user/register")
      .send({
        username: "timo",
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    // Login to get token
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/user/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  // ---------------------------
  // PROFILE PICTURE UPLOAD (AUTH REQUIRED)
  // ---------------------------
  test("POST /api/user/profile-picture uploads an image when authenticated", async () => {
    // Register
    await request(app)
      .post("/api/user/register")
      .send({
        username: "timo",
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    // Login to get token
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({
        email: "timo@example.com",
        password: "StrongPass123!"
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/user/profile-picture")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", Buffer.from("fake image data"), "test.png");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("path");
  });
});
