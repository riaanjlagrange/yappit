const pool = require("../db");

// GET all posts
const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET post by id
const getPostById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [
      req.params.id,
    ]);
    console.log("Fetched post:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET posts by user id
const getPostsByUserId = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE created_by = $1",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// POST create a new post
const createPost = async (req, res) => {
  const { title, content, topic } = req.body;
  const created_by = req.user.id; // Assuming you have user ID from authentication middleware
  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, topic, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, topic, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// PUT update a post by id
const updatePostById = async (req, res) => {
  try {
    // check if post exists
    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
      req.params.id,
    ]);
    if (post.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    // check if user is authorized to update the post
    if (post.rows[0].created_by !== req.user.id) {
      return res
        .status(403)
        .send("You are not authorized to update this post.");
    }

    const { title, content, topic } = req.body;

    const result = await pool.query(
      "UPDATE posts SET title = $1, content = $2, topic = $3 WHERE id = $4 RETURNING *",
      [title, content, topic, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE a post by id
const deletePostById = async (req, res) => {
  try {
    // check post ownership
    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
      req.params.id,
    ]);

    // check if post exists
    if (post.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }

    // check if user is authorized to delete the post
    if (post.rows[0].created_by !== req.user.id) {
      return res
        .status(403)
        .send("You are not authorized to delete this post.");
    }

    // delete all comments associated with the post
    await pool.query("DELETE FROM comments WHERE post_id = $1", [
      req.params.id,
    ]);

    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getPostsByUserId,
};
