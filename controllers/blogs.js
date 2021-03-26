const blogRouter = require('express').Router();
const Blog = require('../models/blog');

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

  const blog = new Blog({
    title: body.title,
    url: body.url,
  });

  const savedBlog = await blog.save();
  res.json(savedBlog);
});

module.exports = blogRouter;
