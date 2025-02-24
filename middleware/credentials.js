const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin); // Set to specific origin
    res.header('Access-Control-Allow-Credentials', true);
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({}); // Return an empty response for OPTIONS
  }

  next();
};

module.exports = credentials;
