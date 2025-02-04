const express = require('express');
const router = express.Router();

const { getAllProjects } = require('../controllers/projectsController');

router.get('/', getAllProjects);

module.exports = router;
