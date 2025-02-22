const router = require('express').Router();
const { createUser } = require('../controllers/usersController');
const {
  userLogin,
  refreshToken,
} = require('../controllers/userAuthController');

router.post('/create-user', createUser);
router.post('/login', userLogin);
router.get('/refresh', refreshToken);
module.exports = router;
