const express = require('express');
const { errorHandler, notFoundHandler } = require('./middleware');
const {
  userRoutes,
  propertyRoutes,
  rentalAgreementRoutes,
  tenantRoutes,
  adminRoutes
} = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agreements', rentalAgreementRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Online Real Estate Management System API',
    version: '1.0.0',
    description: 'API for property listing, rental agreements, tenant management, and system oversight',
    endpoints: {
      users: '/api/users',
      properties: '/api/properties',
      agreements: '/api/agreements',
      tenants: '/api/tenants',
      admin: '/api/admin'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
