const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * User model for the Real Estate Management System
 * Supports different roles: admin, landlord, tenant, agent
 */
class User {
  constructor({ id, email, password, firstName, lastName, phone, role, createdAt, updatedAt }) {
    this.id = id || uuidv4();
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone || null;
    this.role = role || 'tenant'; // admin, landlord, tenant, agent
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Hash the user's password
   */
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  /**
   * Compare password with hashed password
   */
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Get user data without sensitive information
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Get full name
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = User;
