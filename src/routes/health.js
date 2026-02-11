const express = require("express");
const { getDb } = require("../services/database");

const router = express.Router();

// BUG: This endpoint crashes with 500 when the database is unavailable.
// It should return 200 with a degraded status instead of throwing.
router.get("/", (req, res) => {
  const db = getDb();
  const result = db.ping();

  res.json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
