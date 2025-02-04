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

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('welcome!');
});

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

// const randomToken = require('crypto').randomBytes(64).toString('hex');
// console.log(randomToken);
