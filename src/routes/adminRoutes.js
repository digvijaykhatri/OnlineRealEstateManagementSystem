const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// All admin routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard and reports
router.get('/dashboard', adminController.getDashboard);
router.get('/reports/users', adminController.getUserReport);
router.get('/reports/properties', adminController.getPropertyReport);
router.get('/reports/agreements', adminController.getRentalAgreementReport);
router.get('/reports/tenants', adminController.getTenantReport);
router.get('/reports/activity', adminController.getActivitySummary);
router.get('/reports/full', adminController.getFullReport);

module.exports = router;
