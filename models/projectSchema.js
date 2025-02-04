const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
    unique: true,
  },
  projectDesc: {
    type: String,
    required: true,
  },
  codeReviewLink: {
    type: String,
    required: true,
    unique: true,
  },
  livePreviewLink: {
    type: String,
    required: true,
    unique: true,
  },
  imgUrl: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  usedTechStack: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);
