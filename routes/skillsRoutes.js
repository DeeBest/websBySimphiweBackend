const router = require('express').Router();
const { getAllSkills, addSkill } = require('../controllers/skillsController');

router.get('/', getAllSkills);
router.post('/add-skill', addSkill);

module.exports = router;
