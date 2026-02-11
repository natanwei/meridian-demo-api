const { describe, it } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../src/index");

describe("POST /users validation", () => {
  it("should reject an empty body with 400", async () => {
    const res = await request(app).post("/users").send({});
    assert.strictEqual(res.status, 400);
    assert.ok(Array.isArray(res.body.errors));
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes("email"));
    assert.ok(fields.includes("name"));
  });

  it("should reject missing email with 400", async () => {
    const res = await request(app).post("/users").send({ name: "Test User" });
    assert.strictEqual(res.status, 400);
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes("email"));
    assert.ok(!fields.includes("name"));
  });

  it("should reject invalid email formats with 400", async () => {
    const invalidEmails = ["not-an-email", "missing@", "@nodomain", "a@.com", ""];
    for (const email of invalidEmails) {
      const res = await request(app).post("/users").send({ email, name: "Test" });
      assert.strictEqual(res.status, 400, `Expected 400 for email: "${email}"`);
      const fields = res.body.errors.map((e) => e.field);
      assert.ok(fields.includes("email"), `Expected email error for: "${email}"`);
    }
  });

  it("should reject missing or empty name with 400", async () => {
    const res = await request(app).post("/users").send({ email: "test@example.com" });
    assert.strictEqual(res.status, 400);
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes("name"));

    const res2 = await request(app).post("/users").send({ email: "test@example.com", name: "" });
    assert.strictEqual(res2.status, 400);
    const fields2 = res2.body.errors.map((e) => e.field);
    assert.ok(fields2.includes("name"));

    const res3 = await request(app).post("/users").send({ email: "test@example.com", name: "   " });
    assert.strictEqual(res3.status, 400);
    const fields3 = res3.body.errors.map((e) => e.field);
    assert.ok(fields3.includes("name"));
  });

  it("should reject invalid role value with 400", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "test@example.com", name: "Test User", role: "superadmin" });
    assert.strictEqual(res.status, 400);
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes("role"));
  });

  it("should accept valid input with explicit role and return 201", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "valid@example.com", name: "Valid User", role: "admin" });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.email, "valid@example.com");
    assert.strictEqual(res.body.name, "Valid User");
    assert.strictEqual(res.body.role, "admin");
    assert.ok(res.body.id);
  });

  it("should default role to 'member' when not provided", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "default@example.com", name: "Default Role" });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.role, "member");
  });

  it("should return field-level error messages in the 400 response", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "bad", name: "", role: "unknown" });
    assert.strictEqual(res.status, 400);
    assert.ok(Array.isArray(res.body.errors));
    assert.strictEqual(res.body.errors.length, 3);
    for (const err of res.body.errors) {
      assert.ok(err.field, "Each error should have a field property");
      assert.ok(err.message, "Each error should have a message property");
    }
  });
});
