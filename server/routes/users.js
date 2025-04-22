const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/usersController");

const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// GET user by id
router.get("/:id", getUserById);

// TODO: Implement PUT/PATCH to update a user

// DELETE a user
router.delete("/:id", deleteUserById);

module.exports = router;
