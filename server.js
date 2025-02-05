require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');

const credentials = require('./middleware/credentials');
app.use(credentials);

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
app.use(cors(corsOptions));

const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
connectDB();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const multer = require('multer');

const PORT = process.env.PORT || 5000;

//endpoint for getting all projects
app.use('/api/projects', require('./routes/projectsRoutes'));

//endpoint for uploading projects images
// app.use('/api/uploads', require('./routes/uploadsRoutes'));

//creating upload storage
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

app.use('/images', express.static('uploads/images'));

//endpoint for uploading images
app.post('/api/uploads', upload.single('projectImg'), (req, res) => {
  console.log(`Uploaded file: ${req.file.path}`); // Logs the file path
  res.json({
    message: 'Success',
    imageUrl: `http://localhost:${PORT}/api/images/${req.file.filename}`,
  });
});

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

// const randomToken = require('crypto').randomBytes(64).toString('hex');
// console.log(randomToken);
//http://localhost:5000/api/images/projectImg_1738725803755.jpg
