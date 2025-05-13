// configure express
const express = require("express");
const app = express();

// configure dotenv
require("dotenv").config();

// const pool = require("./db");

// middleware
const cors = require("cors");
app.use(cors());

//must be before
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

app.use(express.json());
// routes
const postsRoutes = require("./routes/postsRoutes");
app.use("/api/posts", postsRoutes);

const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", usersRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const commentsRoutes = require("./routes/commentsRoutes");
app.use("/api/comments", commentsRoutes);

const votesRoutes = require("./routes/votesRoutes");
app.use("/api/votes", votesRoutes);

const rolesRoutes = require("./routes/rolesRoutes");
app.use("/api/roles", rolesRoutes);

// run the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
