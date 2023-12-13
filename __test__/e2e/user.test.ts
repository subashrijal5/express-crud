import app from "../../src/server";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { User } from "../utils/dbModule";

let authToken: string = "";
beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.DB_URL =
        "postgres://pafin_user:pafin_password@postgres:5432/pafin_db_test";

    const authRes = await request(app).post("/api/auth").send({
        email: "jane@example.com",
        password: "password",
    });

    authToken = authRes.body.data.token;
});
let validUser: Partial<User>;
describe("User CRUD Operations", () => {
    // User creation endpoint
    describe("POST /api/users", () => {
        it("creates a new user with valid data", async () => {
            const data = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            };
            const res = await request(app)
                .post("/api/users")
                .set("Authorization", authToken)
                .send(data);

            validUser = res.body.data;

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("data.id");
            expect(res.body.data.name).toEqual(data.name);
            expect(res.body.data.email).toEqual(data.email);
        });
        it("returns bad request if username is missing", async () => {
            const res = await request(app)
                .post("/api/users")
                .set("Authorization", authToken)
                .send({
                    email: "missingusername@example.com",
                    password: "password",
                });

            expect(res.statusCode).toEqual(422);
        });

        it("returns bad request if email is missing", async () => {
            const res = await request(app)
                .post("/api/users")
                .set("Authorization", authToken)
                .send({
                    name: "userwithoutemail",
                    password: "password",
                });

            expect(res.statusCode).toEqual(422);
        });

        it("returns bad request if password is missing", async () => {
            const res = await request(app)
                .post("/api/users")
                .set("Authorization", authToken)
                .send({
                    username: "userwithoutpassword",
                    email: "userwithoutpassword@example.com",
                });

            expect(res.statusCode).toEqual(422);
        });

        it("returns conflict if email is already taken", async () => {
            // Assuming "newuser" from the first test is already created
            const res = await request(app)
                .post("/api/users")
                .set("Authorization", authToken)
                .send({
                    name: "newuser",
                    email: "jane@example.com",
                    password: "password",
                });

            expect(res.statusCode).toEqual(422);
        });
    });

    // User retrieval endpoint
    describe("GET /api/users/:userId", () => {
        it("returns user details for a valid user ID", async () => {
            const res = await request(app)
                .get(`/api/users/${validUser.id}`)
                .set("Authorization", authToken);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty("id", validUser.id);
        });

        it("returns error when invalid user id", async () => {
            const notUUId = "abc";
            const res = await request(app)
                .get(`/api/users/${notUUId}`)
                .set("Authorization", authToken);

            expect(res.statusCode).toEqual(422);
        });
        it("returns error when wrong user id", async () => {
            const notUUId = faker.string.uuid();
            const res = await request(app)
                .get(`/api/users/${notUUId}`)
                .set("Authorization", authToken);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message");
        });
    });

    // user list test
    describe("GET /api/users", () => {
        it("returns list of users", async () => {
            const res = await request(app)
                .get(`/api/users`)
                .set("Authorization", authToken);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Array);
        });
        it("returns error when invalid token", async () => {
            const res = await request(app)
                .get(`/api/users`)
                .set("Authorization", "dfsdzfsdf");

            expect(res.statusCode).toEqual(403);
        });
    });

    // user update test
    describe("PUT /api/users/:userId", () => {
        it("updates user details", async () => {
            const newName = "new name";
            const res = await request(app)
                .put(`/api/users/${validUser.id}`)
                .set("Authorization", authToken)
                .send({
                    name: newName,
                    email: validUser.email,
                    password: "newPassword",
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty("id", validUser.id);
            expect(res.body.data.name).toEqual(newName);
        });
        it("returns error when invalid user id", async () => {
            const notUUId = "abc";
            const res = await request(app)
                .put(`/api/users/${notUUId}`)
                .set("Authorization", authToken)
                .send({
                    name: "new name",
                    email: validUser.email,
                    password: "XXXXXXXXXXX",
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty("message");
        });
        it("returns error when wrong user id", async () => {
            const notUUId = faker.string.uuid();
            const res = await request(app)
                .put(`/api/users/${notUUId}`)
                .set("Authorization", authToken)
                .send({
                    name: "my name",
                    email: validUser.email,
                    password: "newPassword",
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty("message");
        });

        it("returns validation error on incomplete request", async () => {
            const res = await request(app)
                .put(`/api/users/${validUser.id}`)
                .set("Authorization", authToken)
                .send();

            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("errors");
        });
    });

    // user delete test
    describe("DELETE /api/users/:userId", () => {
        it("deletes user details", async () => {
            const res = await request(app)
                .delete(`/api/users/${validUser.id}`)
                .set("Authorization", authToken);

            expect(res.statusCode).toEqual(204);
        });
        it("returns error when  invalid user id", async () => {
            const notUUId = "abc";
            const res = await request(app)
                .delete(`/api/users/${notUUId}`)
                .set("Authorization", authToken);

            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty("message");
        });

        it("returns validation error on not exist user Id", async () => {
            const res = await request(app)
                .delete(`/api/users/${validUser.id}`)
                .set("Authorization", authToken)
                .send();

            expect(res.statusCode).toEqual(404);

            expect(res.body).toHaveProperty("message");
        });
    });
});
