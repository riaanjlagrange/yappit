const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
  getAllPosts,
  getPostById,
  createPost,
  deletePostById,
} = require("../controllers/postsController");
const authenticateToken = require("../middleware/auth");

// GET all posts
router.get("/", getAllPosts);

// GET post by id
router.get("/:id", getPostById);

// POST create a new post
router.post("/", authenticateToken, createPost);

// TODO: add PUT to update a post by id

// DELETE a post by id
router.delete("/:id", authenticateToken, deletePostById);

module.exports = router;
