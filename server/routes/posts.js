const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  deletePostById,
  updatePostById,
} = require("../controllers/postsController");
const authenticateToken = require("../middleware/auth");

// GET all posts
router.get("/", getAllPosts);

// GET post by id
router.get("/:id", getPostById);

// POST create a new post
router.post("/", authenticateToken, createPost);

// PUT update a post by id
router.put("/:id", authenticateToken, updatePostById);

// DELETE a post by id
router.delete("/:id", authenticateToken, deletePostById);

module.exports = router;
