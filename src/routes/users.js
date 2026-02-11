const express = require("express");
const { getDb } = require("../services/database");

const router = express.Router();

// GET /users - list all users
router.get("/", (req, res) => {
  const db = getDb();
  const users = db.getAllUsers();
  res.json(users);
});

// POST /users - create a new user
// BUG: No input validation. Accepts any JSON body without checking
// required fields or validating email format.
router.post("/", (req, res) => {
  const { email, name, role } = req.body;
  const db = getDb();
  const user = db.createUser({ email, name, role });
  res.status(201).json(user);
});

// GET /users/:id - get a single user
router.get("/:id", (req, res) => {
  const db = getDb();
  const user = db.getUserById(Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// DELETE /users/:id - delete a user
router.delete("/:id", (req, res) => {
  const db = getDb();
  const deleted = db.deleteUser(Number(req.params.id));

  if (!deleted) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(204).send();
});

module.exports = router;
