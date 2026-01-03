const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

// Register user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.registerUser
);

// Login user
router.post('/login', authController.loginUser);

// Refresh token
router.get('/refresh', authController.handleRefreshToken);

// Logout user
router.get('/logout', authController.logoutUser);

module.exports = router;
