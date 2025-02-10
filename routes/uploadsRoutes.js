// routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadsController');

// Endpoint for uploading images
router.post(
  '/',
  uploadController.uploadMiddleware,
  uploadController.uploadImage
);

module.exports = router;
