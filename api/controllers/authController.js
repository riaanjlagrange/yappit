const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if users already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert new user into database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        description: 'Hey there! I am a new user.',
        password: hashedPassword,
        userRoles: {
          create: {
            role: {
              connect: {
                name: 'USER',
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

    // generate jwt token with roles
    const roles = newUser.userRoles.map((ur) => ur.role.name);
    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, roles },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const refreshToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    // save refresh token to db
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roles,
    };

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken, user: userResponse });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt with email:', email);
  console.log('Login attempt with password:', password);

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
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate jwt token with roles
    const roles = user.userRoles.map((ur) => ur.role.name);
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, roles },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    // save refresh token to db
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
    };

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, user: userResponse });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await prisma.user.findFirst({
    where: { refreshToken },
  });
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    res.json({ roles, accessToken });
  });
};

const logoutUser = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await prisma.user.findFirst({
    where: { refreshToken },
  });
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  await prisma.user.update({
    where: { id: foundUser.id },
    data: { refreshToken: null },
  });

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
  logoutUser,
};
