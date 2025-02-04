const Project = require('../models/projectSchema');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    if (projects.length <= 0)
      return res.status(204).json({ message: 'No projects found' });
    return res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getAllProjects };
