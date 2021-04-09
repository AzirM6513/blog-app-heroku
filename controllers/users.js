const bcyrpt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  const body = req.body;

  if (body.password === undefined) {
    return res.status(400).json({ error: 'password field missing' });
  }

  if (body.password.length <= 3) {
    return res
      .status(400)
      .json({ error: 'password length must be longer than 3 characters' });
  }

  const saltRounds = 10;
  const passwordHash = await bcyrpt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  });
  res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json(user);
});

module.exports = usersRouter;
