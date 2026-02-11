const express = require("express");
const { getDb } = require("../services/database");

const router = express.Router();

// GET /users - list all users
router.get("/", (req, res) => {
  const db = getDb();
  const users = db.getAllUsers();
  res.json(users);
});

const VALID_ROLES = ["admin", "member", "viewer"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", (req, res) => {
  const { email, name, role } = req.body;
  const errors = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "A valid email address is required" });
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required and must be a non-empty string" });
  }

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    errors.push({ field: "role", message: `Role must be one of: ${VALID_ROLES.join(", ")}` });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const db = getDb();
  const user = db.createUser({ email: email.trim(), name: name.trim(), role });
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
