const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { authenticate, authorize, authLimiter, generalLimiter, adminLimiter } = require('../middleware');

// Public routes with auth rate limiting
router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);

// Protected routes with general rate limiting
router.get('/profile', generalLimiter, authenticate, userController.getProfile);
router.put('/profile', generalLimiter, authenticate, userController.updateProfile);
router.put('/password', authLimiter, authenticate, userController.updatePassword);

// Admin routes with admin rate limiting
router.get('/', adminLimiter, authenticate, authorize('admin'), userController.getAllUsers);
router.get('/role/:role', adminLimiter, authenticate, authorize('admin'), userController.getUsersByRole);
router.get('/:id', adminLimiter, authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', adminLimiter, authenticate, authorize('admin'), userController.updateUser);
router.put('/:id/role', adminLimiter, authenticate, authorize('admin'), userController.updateUserRole);
router.delete('/:id', adminLimiter, authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;
