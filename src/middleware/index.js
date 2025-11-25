const { authenticate, authorize, optionalAuth } = require('./auth');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const { generalLimiter, authLimiter, adminLimiter } = require('./rateLimiter');

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  errorHandler,
  notFoundHandler,
  generalLimiter,
  authLimiter,
  adminLimiter
};
