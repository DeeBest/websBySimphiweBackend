const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Forbidden' });
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodedInfo) => {
    if (err) return res.status(403).json({ message: 'Unauthorized' });

    req.username = decodedInfo.username;
    next();
  });
};

module.exports = verifyJwt;
