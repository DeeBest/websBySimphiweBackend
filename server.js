require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static('uploads/images'));

// Routes
app.use('/api/projects', require('./routes/projectsRoutes'));
app.use('/api/skills', require('./routes/skillsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/uploads', require('./routes/uploadsRoutes'));

// Catch-all route
app.use('*', (req, res) =>
  res.status(404).json({ message: 'Requested resource does not exist.' })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
