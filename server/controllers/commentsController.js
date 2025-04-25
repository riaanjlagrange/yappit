const pool = require("../db");

// GET all comments from post
const getAllCommentsFromPost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const response = await pool.query(
      "SELECT c.*, u.name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1",
      [postId]
    );
    console.log("Fetched comments:", response.rows);
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST a comment
const postComment = async (req, res) => {
  const postId = req.params.postId;
  const { userId, content } = req.body;

  try {
    const response = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [postId, userId, content]
    );
    res.status(201).json(response.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a comment
const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  // check post ownership
  const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [
    commentId,
  ]);
  console.log("Fetched comment:", comment.rows[0]);

  // check if post exists
  if (comment.rows.length === 0) {
    return res.status(404).send("Comment not found.");
  }

  // check if user is authorized to delete the post
  if (comment.rows[0].user_id !== req.user.id) {
    return res
      .status(403)
      .send("You are not authorized to delete this comment.");
  }

  try {
    const response = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [commentId]
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found." });
    }
    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCommentsFromPost,
  postComment,
  deleteComment,
};
