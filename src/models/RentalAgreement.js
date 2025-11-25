const { v4: uuidv4 } = require('uuid');

/**
 * RentalAgreement model for the Real Estate Management System
 * Represents a rental agreement between a landlord and tenant
 */
class RentalAgreement {
  constructor({
    id,
    propertyId,
    tenantId,
    landlordId,
    startDate,
    endDate,
    monthlyRent,
    securityDeposit,
    status,
    terms,
    signedByTenant,
    signedByLandlord,
    signedAt,
    createdAt,
    updatedAt
  }) {
    this.id = id || uuidv4();
    this.propertyId = propertyId;
    this.tenantId = tenantId;
    this.landlordId = landlordId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.monthlyRent = monthlyRent;
    this.securityDeposit = securityDeposit || 0;
    this.status = status || 'draft'; // draft, pending, active, expired, terminated
    this.terms = terms || '';
    this.signedByTenant = signedByTenant || false;
    this.signedByLandlord = signedByLandlord || false;
    this.signedAt = signedAt || null;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Check if agreement is active
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * Check if agreement is fully signed
   */
  isFullySigned() {
    return this.signedByTenant && this.signedByLandlord;
  }

  /**
   * Sign the agreement by tenant
   */
  signByTenant() {
    this.signedByTenant = true;
    this.updatedAt = new Date().toISOString();
    this.checkAndActivate();
  }

  /**
   * Sign the agreement by landlord
   */
  signByLandlord() {
    this.signedByLandlord = true;
    this.updatedAt = new Date().toISOString();
    this.checkAndActivate();
  }

  /**
   * Check if fully signed and activate
   */
  checkAndActivate() {
    if (this.isFullySigned() && this.status === 'pending') {
      this.status = 'active';
      this.signedAt = new Date().toISOString();
    }
  }

  /**
   * Terminate the agreement
   */
  terminate(reason) {
    this.status = 'terminated';
    this.terminationReason = reason;
    this.terminatedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Calculate total rent for the agreement period
   */
  calculateTotalRent() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months * this.monthlyRent;
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      propertyId: this.propertyId,
      tenantId: this.tenantId,
      landlordId: this.landlordId,
      startDate: this.startDate,
      endDate: this.endDate,
      monthlyRent: this.monthlyRent,
      securityDeposit: this.securityDeposit,
      status: this.status,
      terms: this.terms,
      signedByTenant: this.signedByTenant,
      signedByLandlord: this.signedByLandlord,
      signedAt: this.signedAt,
      terminationReason: this.terminationReason,
      terminatedAt: this.terminatedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = RentalAgreement;
