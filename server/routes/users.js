const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getUserById);

// TODO: Implement PUT/PATCH to update a user

router.delete("/:id", usersController.deleteUserById);

module.exports = router;
