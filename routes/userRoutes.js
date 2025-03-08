const router = require('express').Router();
const { createUser } = require('../controllers/usersController');
const {
  userLogin,
  refreshToken,
  logout,
} = require('../controllers/userAuthController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/create-user', createUser);
router.post('/login', userLogin);
router.use(verifyJWT);
router.get('/refresh', refreshToken);
router.get('/logout', logout);
module.exports = router;
