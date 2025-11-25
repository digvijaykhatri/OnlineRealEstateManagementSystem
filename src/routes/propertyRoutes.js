const express = require('express');
const router = express.Router();
const { propertyController } = require('../controllers');
const { authenticate, authorize, optionalAuth } = require('../middleware');

// Public routes (with optional auth)
router.get('/', optionalAuth, propertyController.getAllProperties);
router.get('/available', propertyController.getAvailableProperties);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes
router.post('/', authenticate, authorize('landlord', 'admin', 'agent'), propertyController.createProperty);
router.put('/:id', authenticate, propertyController.updateProperty);
router.patch('/:id/status', authenticate, propertyController.updatePropertyStatus);
router.post('/:id/amenities', authenticate, propertyController.addAmenity);
router.post('/:id/images', authenticate, propertyController.addImage);
router.delete('/:id', authenticate, propertyController.deleteProperty);

// Owner-specific routes
router.get('/owner/:ownerId', authenticate, propertyController.getPropertiesByOwner);
router.get('/my/properties', authenticate, propertyController.getPropertiesByOwner);
router.get('/my/statistics', authenticate, propertyController.getPropertyStatistics);

module.exports = router;
