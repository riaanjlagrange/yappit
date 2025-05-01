const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const { authenticateToken } = require("../middleware/auth");

router.get("/:postId", commentsController.getAllCommentsFromPost);
router.post("/:postId", authenticateToken, commentsController.postComment);
router.delete(
  "/:commentId",
  authenticateToken,
  commentsController.deleteComment,
);

module.exports = router;
