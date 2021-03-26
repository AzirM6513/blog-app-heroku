const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('blog api GET', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns correct number of blogs in Database', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(helper.initialBlogs.length);
  });

  test('response contains specific blog', async () => {
    const res = await api.get('/api/blogs');

    const titles = res.body.map((r) => r.title);
    expect(titles).toContain('First class tests');
  });

  test('verify blog uses id over _id', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body.id).toBeDefined();
  });
});

describe('blog api POST', () => {
  test('api can create valid blog entrys', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain(newBlog.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
