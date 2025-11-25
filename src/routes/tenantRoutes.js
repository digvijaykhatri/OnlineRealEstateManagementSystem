const express = require('express');
const router = express.Router();
const { tenantController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Tenant self-service routes
router.post('/', authorize('tenant'), tenantController.createTenant);
router.get('/me', authorize('tenant'), tenantController.getMyProfile);
router.put('/me', authorize('tenant'), tenantController.updateMyProfile);

// Admin/Landlord routes
router.get('/', authorize('admin', 'landlord'), tenantController.getAllTenants);
router.get('/search', authorize('admin', 'landlord'), tenantController.searchTenants);
router.get('/statistics', authorize('admin'), tenantController.getTenantStatistics);
router.delete('/:id', authorize('admin'), tenantController.deleteTenant);

// General routes
router.get('/:id', tenantController.getTenantById);
router.put('/:id', tenantController.updateTenant);
router.post('/:id/references', tenantController.addReference);
router.get('/:id/history', tenantController.getRentalHistory);
router.get('/:id/current-rental', tenantController.getCurrentRental);

module.exports = router;
