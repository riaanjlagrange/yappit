const express = require("express");
const router = express.Router();
const {
  getAllCommentsFromPost,
  postComment,
  deleteComment,
} = require("../controllers/commentsController");
const authenticateToken = require("../middleware/auth");

router.get("/:postId", getAllCommentsFromPost);
router.post("/:postId", authenticateToken, postComment);
router.delete("/:commentId", authenticateToken, deleteComment);

module.exports = router;
