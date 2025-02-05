const multer = require('multer');
const path = require('path');

// Creating upload storage
const storage = multer.diskStorage({
  destination: './uploads/images',
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Controller for handling image uploads
exports.uploadImage = (req, res) => {
  res.json({
    message: 'Success',
    imageUrl: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
  });
};

// Middleware for handling single file upload
exports.uploadMiddleware = upload.single('projectImg');
