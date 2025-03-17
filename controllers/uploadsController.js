const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');

// Configure S3 client with signature version
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: 'v4', // Critical for AWS compatibility [1][4]
});

// Configure allowed file types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/svg',
];

// Configure allowed file extensions
const ALLOWED_EXTENSIONS = ['.svg', '.jpg', '.jpeg', '.png'];

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: (req, file, cb) => {
      // Trust client-provided MIME type if available [1][9]
      if (file.mimetype) {
        cb(null, file.mimetype);
      } else {
        // Fallback to manual detection
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream');
      }
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Log details immediately on function entry
    const ext = path.extname(file.originalname).toLowerCase();
    console.log('Received file:', file.originalname);
    console.log('Client provided MIME type:', file.mimetype);
    console.log('File extension:', ext);

    // Check if the extension is allowed
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      // Fixed extension check
      console.warn('Extension not allowed:', ext);
      return cb(new Error('File type not supported'), false);
    }

    // For SVG files, ensure the MIME type is exactly 'image/svg+xml'
    if (ext === '.svg') {
      if (file.mimetype !== 'image/svg+xml') {
        // Correct MIME check
        console.warn('Invalid SVG MIME type:', file.mimetype);
        return cb(new Error('SVG must be image/svg+xml'), false);
      }
    } else {
      // 3. Check non-SVG files are images
      if (!file.mimetype.startsWith('image/')) {
        console.warn('Non-image MIME type:', file.mimetype);
        return cb(new Error('File must be an image'), false);
      }
    }

    // Proceed with the file if validations pass
    cb(null, true);
  },
});

// Middleware for handling single file upload
exports.uploadMiddleware = upload.single('projectImg');

// Controller for handling image uploads
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded or file type not supported',
      supportedTypes: ALLOWED_MIME_TYPES.join(', '),
    });
  }

  try {
    res.status(200).json({
      message: 'Success',
      imageUrl: req.file.location,
      fileName: req.file.key,
      fileSize: req.file.size,
      metadata: req.file.metadata,
      mimeType: req.file.mimetype, // Added for debugging
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message,
      supportedTypes: ALLOWED_MIME_TYPES.join(', '),
    });
  }
};
