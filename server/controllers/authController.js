const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if users already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert new user into database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        description: "Hey there! I am a new user.",
        password: hashedPassword,
        userRoles: {
          create: {
            role: {
              connect: {
                name: "USER",
              },
            },
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.userRoles.map((ur) => ur.role.name),
    };

    console.log(userResponse);

    res.status(201).json({ user: userResponse });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);
  console.log("Login attempt with password:", password);

  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate jwt token with roles
    const roles = user.userRoles.map((ur) => ur.role.name);
    const token = jwt.sign(
      { id: user.id, email: user.email, roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
    };
    console.log(userResponse);

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
