const { authenticate, authorize, optionalAuth } = require('./auth');
const { errorHandler, notFoundHandler } = require('./errorHandler');

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  errorHandler,
  notFoundHandler
};
