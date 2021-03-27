const logger = require('./logger');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === 'TypeError') {
    return res
      .status(404)
      .json({ error: 'Cannot update nonexistent resource' });
  }

  return next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
