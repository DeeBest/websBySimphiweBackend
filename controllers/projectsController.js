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

const getSingleProject = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  try {
    const project = await Project.findOne({ _id: id }).exec();
    if (!project) {
      return res
        .status(404)
        .json({ message: `No project with id ${id} exists.` });
    }
    res.status(200).json({ message: 'Success', project: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

const updateProject = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: 'Please provide ID' });
  try {
    const project = await Project.findOne({ _id: id });
    if (!project)
      return res
        .status(404)
        .json({ message: `No project with ${id} ID exists.` });

    if (req?.body?.projectName) project.projectName = req.body.projectName;
    if (req?.body?.projectDesc) project.projectDesc = req.body.projectDesc;
    if (req?.body?.codeReviewLink)
      project.codeReviewLink = req.body.codeReviewLink;
    if (req?.body?.livePreviewLink)
      project.livePreviewLink = req.body.livePreviewLink;
    if (req?.body?.imgUrl) project.imgUrl = req.body.imgUrl;
    if (req?.body?.category) project.category = req.body.category;
    if (req?.body?.usedTechStack)
      project.usedTechStack = req.body.usedTechStack;

    await project.save();
    res
      .status(200)
      .json({ message: `Successfully updated project`, project: project });
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

module.exports = {
  getAllProjects,
  addProject,
  deleteProject,
  getSingleProject,
  updateProject,
};
