const multer = require('multer');
const path = require('path');

const storage = multer({
  dest: './uploads/images',
  // limits: {
  //   fileSize: 2000000,
  // },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
