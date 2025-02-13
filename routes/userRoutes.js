const router = require('express').Router();
const { createUser, userLogin } = require('../controllers/usersController');

router.post('/create-user', createUser);
router.post('/login', userLogin);
module.exports = router;
