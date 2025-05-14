const prisma = require("../prisma/client");
const { s3 } = require("../s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
      },
    });

    for (const user of users) {
      const getObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `profile_pics/${user.id}/${user.profilePic}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      // Add the URL to the user object
      user.profilePicUrl = url;
    }

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
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        description: true,
        created_at: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    console.log("Fetched user:", user);

    if (user.profilePic) {
      const getObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `profile_pics/${userId}/${user.profilePic}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      // Add the URL to the user object
      user.profilePicUrl = url;
    }

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

// PUT update user by id
const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE a user
const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists
    if (!user) {
      res.status(404).send("User not found.");
    }

    await prisma.userRole.deleteMany({
      where: { user_id: userId },
    });

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
  updateUserById,
  deleteUserById,
};
