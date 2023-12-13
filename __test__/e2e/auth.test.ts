import app from "../../src/server";
import request from "supertest";

describe("POST to get auth token /api/auth", () => {
    it("returns status code 200 if username and password is correct", async () => {
        const res = await request(app).post("/api/auth").send({
            email: "jane@example.com",
            password: "password",
        });

        // toEqual recursively checks every field of an object or array.
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            success: true,
            message: "Request successful",
            data: {
                token: expect.any(String),
            },
        });
    });

    it("returns bad request if email is missing", async () => {
        const res = await request(app).post("/api/auth").send({
            password: "XXXXXXXX",
        });
        expect(res.statusCode).toEqual(422);
    });
    it("returns bad request if password is missing", async () => {
        const res = await request(app).post("/api/auth").send({
            email: "abc@gm.com",
        });
        expect(res.statusCode).toEqual(422);
    });
});
