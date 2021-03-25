const dummy = () => 1;

// eslint-disable-next-line arrow-body-style
const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.map((blog) => blog.likes).reduce((sum, n) => sum + n, 0);
};

const favoriteBlog = (blogs) => {
  // eslint-disable-next-line arrow-body-style
  const findMostLikes = () => {
    return Math.max.apply(
      null,
      // eslint-disable-next-line comma-dangle
      blogs.map((blog) => blog.likes)
    );
  };

  return blogs.length === 0
    ? null
    : blogs.filter((blog) => blog.likes === findMostLikes())[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
