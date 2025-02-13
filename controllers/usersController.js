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

const userLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'username and password required' });
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: '1d' }
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: 'Successfully logged in', accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, userLogin };
