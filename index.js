const http = require('http');

const app = require('./app');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running`);
});
