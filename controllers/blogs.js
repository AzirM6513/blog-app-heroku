const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    return res.json(blog);
  }

  res.status(404).end();
});

blogRouter.post('/', async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author || user.name,
    url: body.url,
    likes: body.likes || 0,
    dislikes: body.dislikes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.json(savedBlog);
});

blogRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    dislikes: body.dislikes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });

  res.json(updatedBlog.toJSON());
});

blogRouter.delete('/:id', async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  const blog = await Blog.findById(req.params.id);

  console.log(blog);

  if (decodedToken.id !== blog.user.toString()) {
    return res.status(401).json({ error: 'token invalid' });
  }

  await Blog.findByIdAndRemove(req.params.id);

  res.status(204).end();
});

module.exports = blogRouter;
