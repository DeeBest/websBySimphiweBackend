const router = require('express').Router();

const uploadImg = require('../controllers/uploadsController');

router.post('/', uploadImg);

module.exports = router;
