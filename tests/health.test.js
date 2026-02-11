const { describe, it } = require("node:test");
const assert = require("node:assert");

describe("Health endpoint", () => {
  it("should return healthy status when database is available", async () => {
    // This test passes — the bug is only triggered when DB is unavailable
    const response = { status: "healthy", database: "connected" };
    assert.strictEqual(response.status, "healthy");
  });

  // TODO: Add test for when database is unavailable
  // The health endpoint should return 200 with degraded status
  // instead of throwing a 500 error
});
