const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true, // Enable in production
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: 'Successfully logged in', accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(401).json({ message: 'Unauthorized.' });
  const refreshToken = cookies.refreshToken;

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) return res.status(403).json({ message: 'Forbidden' });

    const decodedInfo = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN
    );
    if (foundUser.username !== decodedInfo.username)
      return res.status(403).json({ message: 'Forbidden' });

    const accessToken = jwt.sign(
      { username: decodedInfo.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: '15m' }
    );
    res.status(200).json({ message: 'Success', accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(201).json({ message: 'No cookie to clear' });
  const refreshToken = cookies.refreshToken;

  try {
    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return res.status(204).json({ message: 'Cookie cleared' });
    }

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return res.status(204).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userLogin, refreshToken, logout };
