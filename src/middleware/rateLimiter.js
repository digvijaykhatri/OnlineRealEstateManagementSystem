const rateLimit = require('express-rate-limit');

// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

/**
 * Create a rate limiter or a pass-through middleware for tests
 */
const createLimiter = (options) => {
  if (isTestEnv) {
    // Pass-through middleware for tests
    return (req, res, next) => next();
  }
  return rateLimit(options);
};

/**
 * General rate limiter for all API routes
 * Limits to 100 requests per minute per IP
 */
const generalLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Max requests per window per IP
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict rate limiter for authentication routes
 * Limits to 10 requests per minute per IP to prevent brute force attacks
 */
const authLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max requests per window per IP
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Admin rate limiter for sensitive operations
 * Limits to 50 requests per minute per IP
 */
const adminLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Max requests per window per IP
  message: { error: 'Too many requests to admin endpoints, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  adminLimiter
};
