// In-memory data store
// In production this would be backed by PostgreSQL or SQLite

let users = [
  { id: 1, email: "alice@meridian.dev", name: "Alice Chen", role: "admin", created_at: "2026-01-15T09:00:00Z" },
  { id: 2, email: "bob@meridian.dev", name: "Bob Torres", role: "member", created_at: "2026-01-20T14:30:00Z" },
  { id: 3, email: "carol@meridian.dev", name: "Carol Kim", role: "member", created_at: "2026-02-01T11:00:00Z" },
];

let nextId = 4;

function getDb() {
  return {
    getAllUsers() {
      return [...users];
    },
    getUserById(id) {
      return users.find((u) => u.id === id) || null;
    },
    createUser({ email, name, role }) {
      const user = {
        id: nextId++,
        email,
        name,
        role: role || "member",
        created_at: new Date().toISOString(),
      };
      users.push(user);
      return user;
    },
    deleteUser(id) {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    },
    ping() {
      // Simulates a database health check query
      // Throws if the "database" is down
      return { ok: 1 };
    },
  };
}

module.exports = { getDb };
