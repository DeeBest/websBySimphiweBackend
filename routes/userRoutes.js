const router = require('express').Router();
const { createUser } = require('../controllers/usersController');
const { userLogin } = require('../controllers/userAuthController');

router.post('/create-user', createUser);
router.post('/login', userLogin);
module.exports = router;
