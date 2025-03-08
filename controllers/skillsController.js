const Skill = require('../models/skillSchema');

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    if (skills.length <= 0) {
      return res.status(204).json({ message: 'No skills found' });
    }
    return res.status(200).json({ message: 'Success', skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getSingleSkill = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'No ID was provided' });
  try {
    const skill = await Skill.findOne({ _id: id }).exec();
    if (!skill)
      return res
        .status(404)
        .json({ message: `No skill with ID ${id} was found.` });
    res.status(200).json({ message: 'Success', skill: skill });
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

const updateSkill = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: 'No ID was provided' });

  try {
    const skill = await Skill.findOne({ _id: id });
    if (!skill)
      return res
        .status(404)
        .json({ message: `No skill with ID ${id} was found.` });

    if (req?.body?.skillName) skill.skillName = req.body.skillName;
    if (req?.body?.skillDesc) skill.skillDesc = req.body.skillDesc;
    if (req?.body?.skillImgUrl) skill.skillImgUrl = req.body.skillImgUrl;
    if (req?.body?.category) skill.category = req.body.category;

    await skill.save();

    res.status(200).json({ message: 'Successfully updated the skill', skill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Please provide a valid ID' });

  try {
    const skill = await Skill.findOne({ _id: id });
    if (!skill)
      return res
        .status(404)
        .json({ message: `No skill with ${id} ID was found.` });
    await Skill.deleteOne(skill);
    res
      .status(204)
      .json({ message: `Successfully deleted ${skill.skillName} skill.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSkills,
  addSkill,
  getSingleSkill,
  updateSkill,
  deleteSkill,
};
