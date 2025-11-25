const { userService } = require('../services');

/**
 * User controller handles HTTP requests for user operations
 */
const userController = {
  /**
   * Register a new user
   */
  async register(req, res, next) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user profile
   */
  getProfile(req, res, next) {
    try {
      const user = userService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user by ID
   */
  getUserById(req, res, next) {
    try {
      const user = userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers(req, res, next) {
    try {
      const users = userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get users by role
   */
  getUsersByRole(req, res, next) {
    try {
      const users = userService.getUsersByRole(req.params.role);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update current user profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateUser(req.user.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user by ID (admin)
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update password
   */
  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.updatePassword(req.user.id, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user role (admin only)
   */
  updateUserRole(req, res, next) {
    try {
      const user = userService.updateUserRole(req.params.id, req.body.role);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete user (admin only)
   */
  deleteUser(req, res, next) {
    try {
      const result = userService.deleteUser(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
