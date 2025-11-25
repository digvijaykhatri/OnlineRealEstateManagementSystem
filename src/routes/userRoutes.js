const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/password', authenticate, userController.updatePassword);

// Admin routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/role/:role', authenticate, authorize('admin'), userController.getUsersByRole);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);
router.put('/:id/role', authenticate, authorize('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;
