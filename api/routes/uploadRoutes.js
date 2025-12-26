const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload } = require('../s3');
const { authenticateToken } = require('../middleware/auth');

router.post(
  '/profilePic',
  authenticateToken,
  upload.single('profilePic'),
  uploadController.uploadProfilePicture,
);

module.exports = router;
