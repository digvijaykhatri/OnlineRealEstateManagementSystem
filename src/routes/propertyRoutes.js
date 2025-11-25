const express = require('express');
const router = express.Router();
const { propertyController } = require('../controllers');
const { authenticate, authorize, optionalAuth, generalLimiter } = require('../middleware');

// Public routes (with optional auth and rate limiting)
router.get('/', generalLimiter, optionalAuth, propertyController.getAllProperties);
router.get('/available', generalLimiter, propertyController.getAvailableProperties);
router.get('/search', generalLimiter, propertyController.searchProperties);
router.get('/:id', generalLimiter, propertyController.getPropertyById);

// Protected routes with rate limiting
router.post('/', generalLimiter, authenticate, authorize('landlord', 'admin', 'agent'), propertyController.createProperty);
router.put('/:id', generalLimiter, authenticate, propertyController.updateProperty);
router.patch('/:id/status', generalLimiter, authenticate, propertyController.updatePropertyStatus);
router.post('/:id/amenities', generalLimiter, authenticate, propertyController.addAmenity);
router.post('/:id/images', generalLimiter, authenticate, propertyController.addImage);
router.delete('/:id', generalLimiter, authenticate, propertyController.deleteProperty);

// Owner-specific routes with rate limiting
router.get('/owner/:ownerId', generalLimiter, authenticate, propertyController.getPropertiesByOwner);
router.get('/my/properties', generalLimiter, authenticate, propertyController.getPropertiesByOwner);
router.get('/my/statistics', generalLimiter, authenticate, propertyController.getPropertyStatistics);

module.exports = router;
