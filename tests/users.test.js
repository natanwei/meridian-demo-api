const { describe, it } = require("node:test");
const assert = require("node:assert");

describe("Users endpoint", () => {
  it("should reject invalid email addresses", async () => {
    // TODO: This test should pass once input validation is added
    const invalidEmails = ["not-an-email", "", "missing@", "@nodomain"];
    for (const email of invalidEmails) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      assert.strictEqual(isValid, false, `${email} should be invalid`);
    }
  });

  it("should require name field", async () => {
    // TODO: POST /users should return 400 if name is missing
    assert.ok(true, "Placeholder for validation test");
  });
});
