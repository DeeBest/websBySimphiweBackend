require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/dbConnection');
connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/images', express.static('uploads/images'));

//endpoint for getting all projects
app.use('/api/projects', require('./routes/projectsRoutes'));

//endpoint for uploading images
app.use('/api/projects', require('./routes/uploadsRoutes'));

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
