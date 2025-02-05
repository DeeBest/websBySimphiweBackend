const upload = require('../middleware/multerMiddleware');

const uploadImg = (req, res) => {
  upload.single('projectImg'),
    (req,
    res,
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading image' });
      } else {
        res.status(200).json({
          message: 'Success',
          imgUrl: `http://localhost:5000/api/images/${req.file.filename}`,
        });
      }
    });
};

module.exports = uploadImg;
