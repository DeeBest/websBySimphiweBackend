const router = require('express').Router();
const {
  getAllSkills,
  addSkill,
  getSingleSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillsController');

router.get('/', getAllSkills);
router.get('/:id', getSingleSkill);
router.post('/add-skill', addSkill);
router.put('/update-skill/:id', updateSkill);
router.delete('/delete-skill/:id', deleteSkill);

module.exports = router;
