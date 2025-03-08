const verifyJWT = require('../middleware/verifyJWT');

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadsController');

router.use(verifyJWT);

// Endpoint for uploading images
router.post(
  '/',
  uploadController.uploadMiddleware,
  uploadController.uploadImage
);

module.exports = router;
