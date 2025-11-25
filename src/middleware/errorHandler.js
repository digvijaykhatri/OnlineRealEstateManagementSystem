/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Default error status and message
  let status = 500;
  let message = 'Internal server error';

  // Handle known error types
  if (err.message === 'User with this email already exists') {
    status = 409;
    message = err.message;
  } else if (err.message === 'Invalid email or password') {
    status = 401;
    message = err.message;
  } else if (err.message === 'Invalid or expired token') {
    status = 401;
    message = err.message;
  } else if (err.message.includes('not found')) {
    status = 404;
    message = err.message;
  } else if (err.message.includes('Not authorized') || err.message.includes('Only')) {
    status = 403;
    message = err.message;
  } else if (err.message.includes('already exists')) {
    status = 409;
    message = err.message;
  } else if (err.message.includes('Cannot') || err.message.includes('must be')) {
    status = 400;
    message = err.message;
  } else if (err.message.includes('Invalid')) {
    status = 400;
    message = err.message;
  }

  res.status(status).json({ error: message });
};

/**
 * Not found handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
