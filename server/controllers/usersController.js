const pool = require("../db");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET user by id
const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found.");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE a user
const deleteUserById = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
};
