const express = require("express");
const { getDb } = require("./services/database");
const healthRouter = require("./routes/health");
const usersRouter = require("./routes/users");

const app = express();
app.use(express.json());

app.use("/health", healthRouter);
app.use("/users", usersRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Meridian API running on port ${PORT}`);
});

module.exports = app;
