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
const postRoutes = require("./routes/posts");
app.use("/posts", postRoutes);
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// run the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
