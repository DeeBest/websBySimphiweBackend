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

const addProject = async (req, res) => {
  const {
    projectName,
    projectDesc,
    codeReviewLink,
    livePreviewLink,
    imgUrl,
    category,
    usedTechStack,
  } = req.body;

  if (
    !projectName ||
    !projectDesc ||
    !codeReviewLink ||
    !livePreviewLink ||
    !imgUrl ||
    !category ||
    !usedTechStack
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const duplicate = await Project.findOne({
      projectName: req.projectName,
    }).exec();

    if (duplicate) {
      return res
        .status(409)
        .json({ message: `A project with ${projectName} already exists.` });
    } else {
      const project = await Project.create({
        projectName,
        projectDesc,
        codeReviewLink,
        livePreviewLink,
        imgUrl,
        category,
        usedTechStack,
      });
      return res.status(201).json({ project });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: 'ID required' });

  try {
    const project = await Project.findOne({ _id: id });
    if (!project)
      return res
        .status(400)
        .json({ message: `No project found with ${id} ID.` });
    await Project.deleteOne(project);
    res.status(204).json({
      message: `Successfully deleted ${project.projectName} project.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProjects, addProject, deleteProject };
