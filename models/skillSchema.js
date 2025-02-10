const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  skillName: {
    type: String,
    required: true,
  },
  skillDesc: {
    type: String,
    required: true,
  },
  skillImgUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Skill', skillSchema);
