const router = require('express').Router();
const { createUser } = require('../controllers/usersController');
const {
  userLogin,
  refreshToken,
  logout,
} = require('../controllers/userAuthController');

router.post('/create-user', createUser);
router.post('/login', userLogin);
router.get('/refresh', refreshToken);
router.get('/logout', logout);
module.exports = router;
