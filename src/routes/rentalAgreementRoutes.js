const express = require('express');
const router = express.Router();
const { rentalAgreementController } = require('../controllers');
const { authenticate, authorize, generalLimiter, adminLimiter } = require('../middleware');

// All routes require authentication and rate limiting
router.use(generalLimiter);
router.use(authenticate);

// Admin routes
router.get('/', adminLimiter, authorize('admin'), rentalAgreementController.getAllAgreements);
router.get('/active', adminLimiter, authorize('admin', 'landlord'), rentalAgreementController.getActiveAgreements);
router.get('/statistics', adminLimiter, authorize('admin'), rentalAgreementController.getAgreementStatistics);
router.delete('/:id', adminLimiter, authorize('admin'), rentalAgreementController.deleteAgreement);

// Landlord routes
router.post('/', authorize('landlord', 'admin'), rentalAgreementController.createAgreement);
router.post('/:id/send-for-signing', authorize('landlord', 'admin'), rentalAgreementController.sendForSigning);
router.post('/:id/sign/landlord', authorize('landlord', 'admin'), rentalAgreementController.signByLandlord);
router.post('/:id/terminate', authorize('landlord', 'admin'), rentalAgreementController.terminateAgreement);

// Tenant routes
router.post('/:id/sign/tenant', authorize('tenant'), rentalAgreementController.signByTenant);
router.get('/tenant/:tenantId', rentalAgreementController.getAgreementsByTenant);
router.get('/my/agreements', rentalAgreementController.getAgreementsByTenant);

// General routes
router.get('/landlord/:landlordId', rentalAgreementController.getAgreementsByLandlord);
router.get('/property/:propertyId', rentalAgreementController.getAgreementsByProperty);
router.get('/:id', rentalAgreementController.getAgreementById);
router.put('/:id', rentalAgreementController.updateAgreement);

module.exports = router;
