const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  addProject,
} = require('../controllers/projectsController');

router.get('/', getAllProjects);
router.post('/add-project', addProject);

module.exports = router;
