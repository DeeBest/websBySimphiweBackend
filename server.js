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

//endpoint for projects routes
app.use('/api/projects', require('./routes/projectsRoutes'));
//endpoint for skills routes
app.use('/api/skills', require('./routes/skillsRoutes'));
//routes for users
app.use('/api/users', require('./routes/userRoutes'));

//endpoint for uploading images
app.use('/api/uploads', require('./routes/uploadsRoutes'));

//catch all route
app.use('*', (req, res) =>
  res.status(404).json({ message: 'Requested resource does not exists.' })
);

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
