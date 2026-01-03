// configure dotenv
require('dotenv').config();

// configure express
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// const pool = require("./db");

// middleware
const cors = require('cors');
app.use(cors());
app.use(cookieParser());

// Apply to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

//must be before
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

app.use(express.json());
// routes
const postsRoutes = require('./routes/postsRoutes');
app.use('/api/posts', postsRoutes);

const usersRoutes = require('./routes/usersRoutes');
app.use('/api/users', usersRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const commentsRoutes = require('./routes/commentsRoutes');
app.use('/api/comments', commentsRoutes);

const votesRoutes = require('./routes/votesRoutes');
app.use('/api/votes', votesRoutes);

const rolesRoutes = require('./routes/rolesRoutes');
app.use('/api/roles', rolesRoutes);

// run the server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port http://localhost:${PORT}`)
});
