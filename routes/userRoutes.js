const router = require('express').Router();
const { createUser } = require('../controllers/usersController');

router.post('/create-user', createUser);

module.exports = router;
