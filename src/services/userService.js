const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dataStore = require('../utils/dataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'real-estate-management-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * UserService handles all user-related operations
 */
class UserService {
  /**
   * Register a new user
   */
  async register(userData) {
    // Check if user already exists
    const existingUser = dataStore.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = new User(userData);
    await user.hashPassword();
    
    dataStore.createUser(user);
    return user.toJSON();
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = dataStore.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: user.toJSON(),
      token
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  getUserById(id) {
    const user = dataStore.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers() {
    return dataStore.getAllUsers().map(u => u.toJSON());
  }

  /**
   * Get users by role
   */
  getUsersByRole(role) {
    return dataStore.getAllUsers()
      .filter(u => u.role === role)
      .map(u => u.toJSON());
  }

  /**
   * Update user profile
   */
  async updateUser(id, updates) {
    // Prevent updating sensitive fields directly
    const { password, role, ...safeUpdates } = updates;
    
    const user = dataStore.updateUser(id, safeUpdates);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  /**
   * Update user password
   */
  async updatePassword(id, currentPassword, newPassword) {
    const user = dataStore.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.hashPassword();
    user.updatedAt = new Date().toISOString();
    
    return { message: 'Password updated successfully' };
  }

  /**
   * Update user role (admin only)
   */
  updateUserRole(id, newRole) {
    const validRoles = ['admin', 'landlord', 'tenant', 'agent'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role');
    }

    const user = dataStore.updateUser(id, { role: newRole });
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id) {
    const deleted = dataStore.deleteUser(id);
    if (!deleted) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
