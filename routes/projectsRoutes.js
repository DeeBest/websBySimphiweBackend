const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verifyJWT');

const {
  getAllProjects,
  addProject,
  deleteProject,
  getSingleProject,
  updateProject,
} = require('../controllers/projectsController');

router.get('/', getAllProjects);
router.use(verifyJwt);
router.post('/add-project', addProject);
router.delete('/delete-project/:id', deleteProject);
router.get('/:id', getSingleProject);
router.put('/update-project/:id', updateProject);

module.exports = router;
