const { RentalAgreement } = require('../models');
const dataStore = require('../utils/dataStore');

/**
 * RentalAgreementService handles all rental agreement operations
 */
class RentalAgreementService {
  /**
   * Create a new rental agreement
   */
  createAgreement(agreementData) {
    // Validate property exists and is available
    const property = dataStore.getPropertyById(agreementData.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    if (property.status !== 'available') {
      throw new Error('Property is not available for rent');
    }

    // Validate tenant exists
    const tenant = dataStore.getUserById(agreementData.tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Validate landlord exists
    const landlord = dataStore.getUserById(agreementData.landlordId);
    if (!landlord) {
      throw new Error('Landlord not found');
    }

    // Create the agreement
    const agreement = new RentalAgreement(agreementData);
    dataStore.createRentalAgreement(agreement);

    return agreement.toJSON();
  }

  /**
   * Get rental agreement by ID
   */
  getAgreementById(id) {
    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }
    return agreement.toJSON();
  }

  /**
   * Get all rental agreements
   */
  getAllAgreements() {
    return dataStore.getAllRentalAgreements().map(a => a.toJSON());
  }

  /**
   * Get agreements by tenant
   */
  getAgreementsByTenant(tenantId) {
    return dataStore.getRentalAgreementsByTenant(tenantId).map(a => a.toJSON());
  }

  /**
   * Get agreements by landlord
   */
  getAgreementsByLandlord(landlordId) {
    return dataStore.getRentalAgreementsByLandlord(landlordId).map(a => a.toJSON());
  }

  /**
   * Get agreements by property
   */
  getAgreementsByProperty(propertyId) {
    return dataStore.getRentalAgreementsByProperty(propertyId).map(a => a.toJSON());
  }

  /**
   * Get active agreements
   */
  getActiveAgreements() {
    return dataStore.getActiveRentalAgreements().map(a => a.toJSON());
  }

  /**
   * Update agreement
   */
  updateAgreement(id, updates, requestingUserId, requestingUserRole) {
    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }

    // Only landlord, tenant, or admin can update
    const isAuthorized = 
      agreement.landlordId === requestingUserId ||
      agreement.tenantId === requestingUserId ||
      requestingUserRole === 'admin';

    if (!isAuthorized) {
      throw new Error('Not authorized to update this agreement');
    }

    // Cannot update active or terminated agreements (except by admin)
    if ((agreement.status === 'active' || agreement.status === 'terminated') && requestingUserRole !== 'admin') {
      throw new Error('Cannot modify active or terminated agreements');
    }

    const updatedAgreement = dataStore.updateRentalAgreement(id, updates);
    return updatedAgreement.toJSON();
  }

  /**
   * Sign agreement by tenant
   */
  signByTenant(id, tenantId) {
    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }

    if (agreement.tenantId !== tenantId) {
      throw new Error('Not authorized to sign this agreement');
    }

    if (agreement.status !== 'pending') {
      throw new Error('Agreement must be in pending status to sign');
    }

    agreement.signByTenant();

    // If fully signed, update property status
    if (agreement.isFullySigned()) {
      const property = dataStore.getPropertyById(agreement.propertyId);
      if (property) {
        property.updateStatus('rented');
      }

      // Update tenant's current rental
      const tenant = dataStore.getTenantByUserId(tenantId);
      if (tenant) {
        tenant.updateCurrentRental(agreement.propertyId, agreement.id);
      }
    }

    return agreement.toJSON();
  }

  /**
   * Sign agreement by landlord
   */
  signByLandlord(id, landlordId) {
    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }

    if (agreement.landlordId !== landlordId) {
      throw new Error('Not authorized to sign this agreement');
    }

    if (agreement.status !== 'pending') {
      throw new Error('Agreement must be in pending status to sign');
    }

    agreement.signByLandlord();

    // If fully signed, update property status
    if (agreement.isFullySigned()) {
      const property = dataStore.getPropertyById(agreement.propertyId);
      if (property) {
        property.updateStatus('rented');
      }

      // Update tenant's current rental
      const tenant = dataStore.getTenantByUserId(agreement.tenantId);
      if (tenant) {
        tenant.updateCurrentRental(agreement.propertyId, agreement.id);
      }
    }

    return agreement.toJSON();
  }

  /**
   * Send agreement for signing (change from draft to pending)
   */
  sendForSigning(id, landlordId) {
    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }

    if (agreement.landlordId !== landlordId) {
      throw new Error('Only the landlord can send agreement for signing');
    }

    if (agreement.status !== 'draft') {
      throw new Error('Agreement must be in draft status to send for signing');
    }

    agreement.status = 'pending';
    agreement.updatedAt = new Date().toISOString();

    return agreement.toJSON();
  }

  /**
   * Terminate agreement
   */
  terminateAgreement(id, reason, requestingUserId, requestingUserRole) {
    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }

    // Only landlord or admin can terminate
    if (agreement.landlordId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to terminate this agreement');
    }

    if (agreement.status !== 'active') {
      throw new Error('Only active agreements can be terminated');
    }

    agreement.terminate(reason);

    // Update property status back to available
    const property = dataStore.getPropertyById(agreement.propertyId);
    if (property) {
      property.updateStatus('available');
    }

    // Update tenant's rental history and clear current rental
    const tenant = dataStore.getTenantByUserId(agreement.tenantId);
    if (tenant) {
      tenant.addRentalHistory({
        propertyId: agreement.propertyId,
        agreementId: agreement.id,
        startDate: agreement.startDate,
        endDate: new Date().toISOString(),
        landlordId: agreement.landlordId
      });
      tenant.clearCurrentRental();
    }

    return agreement.toJSON();
  }

  /**
   * Delete agreement (admin only, only draft agreements)
   */
  deleteAgreement(id, requestingUserRole) {
    if (requestingUserRole !== 'admin') {
      throw new Error('Only admins can delete agreements');
    }

    const agreement = dataStore.getRentalAgreementById(id);
    if (!agreement) {
      throw new Error('Rental agreement not found');
    }

    if (agreement.status !== 'draft') {
      throw new Error('Only draft agreements can be deleted');
    }

    dataStore.deleteRentalAgreement(id);
    return { message: 'Rental agreement deleted successfully' };
  }

  /**
   * Get agreement statistics
   */
  getAgreementStatistics() {
    const agreements = dataStore.getAllRentalAgreements();
    const activeAgreements = agreements.filter(a => a.status === 'active');

    return {
      total: agreements.length,
      draft: agreements.filter(a => a.status === 'draft').length,
      pending: agreements.filter(a => a.status === 'pending').length,
      active: activeAgreements.length,
      expired: agreements.filter(a => a.status === 'expired').length,
      terminated: agreements.filter(a => a.status === 'terminated').length,
      totalMonthlyRevenue: activeAgreements.reduce((sum, a) => sum + a.monthlyRent, 0),
      averageRent: activeAgreements.length > 0 
        ? activeAgreements.reduce((sum, a) => sum + a.monthlyRent, 0) / activeAgreements.length 
        : 0
    };
  }
}

module.exports = new RentalAgreementService();
