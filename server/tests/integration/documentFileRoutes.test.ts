import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../../src/app";
import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { Document } from "../../src/models/Document";

describe("Document File Routes", () => {

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
    // IMAGE UPLOAD
    // ---------------------------
    test("POST /api/document/:id/images uploads an image and returns URL", async () => {
        // Create document
        const createRes = await request(app)
            .post("/api/document")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Image Doc",
                content: "Content"
            });

        const docId = createRes.body.id;

        // Use a small test file
        const testImagePath = path.join(__dirname, "../helpers/test-image.png");
        fs.writeFileSync(testImagePath, Buffer.from([137, 80, 78, 71])); // PNG header

        const res = await request(app)
            .post(`/api/document/${docId}/images`)
            .set("Authorization", `Bearer ${token}`)
            .attach("image", testImagePath);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("url");
        expect(res.body.url).toContain("/uploads/documents/");

        // Cleanup test file
        fs.unlinkSync(testImagePath);
    });

    // ---------------------------
    // PDF GENERATION
    // ---------------------------
    test("GET /api/document/:id/pdf generates a PDF", async () => {
        // Create document
        const createRes = await request(app)
            .post("/api/document")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "PDF Doc",
                content: "This is PDF content"
            });

        const docId = createRes.body.id;

        let pdfBuffer = Buffer.alloc(0);

        const res = await request(app)
            .get(`/api/document/${docId}/pdf`)
            .set("Authorization", `Bearer ${token}`)
            .buffer()
            .parse((res, cb) => {
                const chunks: Buffer[] = [];

                res.on("data", (chunk: Buffer) => chunks.push(chunk));
                res.on("end", () => {
                    pdfBuffer = Buffer.concat(chunks);
                    cb(null, pdfBuffer);
                });
            });

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toBe("application/pdf");
        expect(res.headers["content-disposition"]).toContain("attachment");
        expect(pdfBuffer.length).toBeGreaterThan(100);
    });


    // ---------------------------
    // PDF ACCESS CONTROL
    // ---------------------------
    test("GET /api/document/:id/pdf denies access to non-owner non-editor", async () => {
        // Create document
        const createRes = await request(app)
            .post("/api/document")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Private Doc",
                content: "Secret"
            });

        const docId = createRes.body.id;

        // Register second user
        const register2 = await request(app)
            .post("/api/user/register")
            .send({
                username: "other",
                email: "other@example.com",
                password: "StrongPass123!"
            });

        const login2 = await request(app)
            .post("/api/user/login")
            .send({
                email: "other@example.com",
                password: "StrongPass123!"
            });

        const token2 = login2.body.token;

        const res = await request(app)
            .get(`/api/document/${docId}/pdf`)
            .set("Authorization", `Bearer ${token2}`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Not allowed");
    });

});
