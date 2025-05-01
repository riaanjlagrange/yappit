const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    req.token = token;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = req.user;

  try {
    if (!user) return res.sendStatus(401); // Unauthorized

    if (!user.roles.includes("ADMIN")) {
      res.sendStatus(403).send("Admin Access Required");
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(400).send("An Unknown Error Occured");
  }
};

// TODO: Add hasRole middleware to check custom roles
module.exports = { authenticateToken, isAdmin };
