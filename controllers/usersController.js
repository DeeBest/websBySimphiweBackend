const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const duplicate = await User.findOne({ username }).exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: `A user with ${username} already exists.` });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ message: `Successfully created ${username} user.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser };
