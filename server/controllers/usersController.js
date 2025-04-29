const prisma = require("../prisma/client");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Check if users exist
    if (users.length === 0) {
      return res.status(404).send("No users found.");
    }
    console.log("Fetched users:", users);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET user by id
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE a user
const deleteUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists
    if (!user) {
      res.status(404).send("User not found.");
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
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
