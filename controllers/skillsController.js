const Skill = require('../models/skillSchema');

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    if (skills.length <= 0) {
      return res.status(204).json({ message: 'No skills found' });
    }
    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addSkill = async (req, res) => {
  const { skillName, skillDesc, skillImgUrl, category } = req.body;

  if (!skillName || !skillDesc || !skillImgUrl || !category)
    return res.status(400).json({ message: 'All fields are required!' });

  try {
    const duplicate = await Skill.findOne({ skillName }).exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: `A project with ${skillName} already exists.` });

    const skill = await Skill.create({
      skillName,
      skillDesc,
      skillImgUrl,
      category,
    });
    return res.status(200).json({ skill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllSkills, addSkill };
