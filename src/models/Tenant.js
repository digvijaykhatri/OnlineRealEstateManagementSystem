const { v4: uuidv4 } = require('uuid');

/**
 * Tenant model for the Real Estate Management System
 * Represents tenant-specific information and history
 */
class Tenant {
  constructor({
    id,
    userId,
    currentPropertyId,
    currentAgreementId,
    employmentStatus,
    employer,
    annualIncome,
    creditScore,
    previousAddresses,
    references,
    rentalHistory,
    createdAt,
    updatedAt
  }) {
    this.id = id || uuidv4();
    this.userId = userId;
    this.currentPropertyId = currentPropertyId || null;
    this.currentAgreementId = currentAgreementId || null;
    this.employmentStatus = employmentStatus || 'employed'; // employed, self-employed, unemployed, retired, student
    this.employer = employer || '';
    this.annualIncome = annualIncome || 0;
    this.creditScore = creditScore || null;
    this.previousAddresses = previousAddresses || [];
    this.references = references || [];
    this.rentalHistory = rentalHistory || [];
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Check if tenant has active rental
   */
  hasActiveRental() {
    return this.currentPropertyId !== null && this.currentAgreementId !== null;
  }

  /**
   * Add rental history entry
   */
  addRentalHistory(entry) {
    this.rentalHistory.push({
      propertyId: entry.propertyId,
      agreementId: entry.agreementId,
      startDate: entry.startDate,
      endDate: entry.endDate,
      landlordId: entry.landlordId,
      rating: entry.rating || null,
      addedAt: new Date().toISOString()
    });
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add reference
   */
  addReference(reference) {
    this.references.push({
      name: reference.name,
      relationship: reference.relationship,
      phone: reference.phone,
      email: reference.email,
      addedAt: new Date().toISOString()
    });
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Update current rental
   */
  updateCurrentRental(propertyId, agreementId) {
    this.currentPropertyId = propertyId;
    this.currentAgreementId = agreementId;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Clear current rental (when lease ends)
   */
  clearCurrentRental() {
    this.currentPropertyId = null;
    this.currentAgreementId = null;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      currentPropertyId: this.currentPropertyId,
      currentAgreementId: this.currentAgreementId,
      employmentStatus: this.employmentStatus,
      employer: this.employer,
      annualIncome: this.annualIncome,
      creditScore: this.creditScore,
      previousAddresses: this.previousAddresses,
      references: this.references,
      rentalHistory: this.rentalHistory,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Tenant;
