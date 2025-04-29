// configure express
const express = require("express");
const app = express();

// configure dotenv
require("dotenv").config();

// const pool = require("./db");

// middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

// routes
const postRoutes = require("./routes/postsRoutes");
app.use("/api/posts", postRoutes);
const userRoutes = require("./routes/usersRoutes");
app.use("/api/users", userRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const commentRoutes = require("./routes/commentsRoutes");
app.use("/api/comments", commentRoutes);
const voteRoutes = require("./routes/votesRoutes");
app.use("/api/votes", voteRoutes);

// run the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
