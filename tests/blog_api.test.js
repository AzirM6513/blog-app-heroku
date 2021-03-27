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

  test('correct number of blogs in Database', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(helper.initialBlogs.length);
  });

  test('specific blog exists', async () => {
    const res = await api.get('/api/blogs');

    const titles = res.body.map((r) => r.title);
    expect(titles).toContain('First class tests');
  });

  test('verify blog swaps id for _id', async () => {
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
  test('create valid blog entry', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10,
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

  test('likes default to zero when none provided', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    };

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.likes).toBeDefined();
    expect(res.body.likes).toBe(0);
  });

  test('malformed blog fails to POST', async () => {
    const newBlog = {
      author: 'Michael Chan',
    };

    const res = await api.post('/api/blogs').send(newBlog).expect(400);

    expect(res.text).toBe(
      '{"error":"Blog validation failed: title: Path `title` is required., url: Path `url` is required."}'
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
