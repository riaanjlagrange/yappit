const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const authenticateToken = require("../middleware/auth");

// GET all posts
router.get("/", postsController.getAllPosts);

// GET post by id
router.get("/:id", postsController.getPostById);

// GET posts by userid
router.get("/user/:id", authenticateToken, postsController.getPostsByUserId);

// GET post scores by post id
router.get("/score/:id", postsController.getPostScore);

// POST create a new post
router.post("/", authenticateToken, postsController.createPost);

// PUT update a post by id
router.put("/:id", authenticateToken, postsController.updatePostById);

// DELETE a post by id
router.delete("/:id", authenticateToken, postsController.deletePostById);

module.exports = router;
