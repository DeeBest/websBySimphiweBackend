const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  addProject,
  deleteProject,
} = require('../controllers/projectsController');

router.get('/', getAllProjects);
router.post('/add-project', addProject);
router.delete('/:id', deleteProject);

module.exports = router;
