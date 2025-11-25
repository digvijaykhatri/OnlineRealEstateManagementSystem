const { Tenant } = require('../models');
const dataStore = require('../utils/dataStore');

/**
 * TenantService handles all tenant-related operations
 */
class TenantService {
  /**
   * Create a new tenant profile
   */
  createTenant(tenantData) {
    // Verify user exists
    const user = dataStore.getUserById(tenantData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if tenant profile already exists
    const existingTenant = dataStore.getTenantByUserId(tenantData.userId);
    if (existingTenant) {
      throw new Error('Tenant profile already exists for this user');
    }

    const tenant = new Tenant(tenantData);
    dataStore.createTenant(tenant);
    return tenant.toJSON();
  }

  /**
   * Get tenant by ID
   */
  getTenantById(id) {
    const tenant = dataStore.getTenantById(id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    return tenant.toJSON();
  }

  /**
   * Get tenant by user ID
   */
  getTenantByUserId(userId) {
    const tenant = dataStore.getTenantByUserId(userId);
    if (!tenant) {
      throw new Error('Tenant profile not found for this user');
    }
    return tenant.toJSON();
  }

  /**
   * Get all tenants
   */
  getAllTenants() {
    return dataStore.getAllTenants().map(t => t.toJSON());
  }

  /**
   * Update tenant profile
   */
  updateTenant(id, updates, requestingUserId, requestingUserRole) {
    const tenant = dataStore.getTenantById(id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Only the tenant or admin can update
    if (tenant.userId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to update this tenant profile');
    }

    const updatedTenant = dataStore.updateTenant(id, updates);
    return updatedTenant.toJSON();
  }

  /**
   * Add reference to tenant profile
   */
  addReference(tenantId, reference, requestingUserId, requestingUserRole) {
    const tenant = dataStore.getTenantById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    if (tenant.userId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to update this tenant profile');
    }

    tenant.addReference(reference);
    return tenant.toJSON();
  }

  /**
   * Get tenant rental history
   */
  getRentalHistory(tenantId, requestingUserId, requestingUserRole) {
    const tenant = dataStore.getTenantById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Only tenant, their landlords, or admin can view history
    if (tenant.userId !== requestingUserId && requestingUserRole !== 'admin' && requestingUserRole !== 'landlord') {
      throw new Error('Not authorized to view this tenant\'s history');
    }

    return tenant.rentalHistory;
  }

  /**
   * Get current rental information
   */
  getCurrentRental(tenantId) {
    const tenant = dataStore.getTenantById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    if (!tenant.hasActiveRental()) {
      return null;
    }

    const property = dataStore.getPropertyById(tenant.currentPropertyId);
    const agreement = dataStore.getRentalAgreementById(tenant.currentAgreementId);

    return {
      property: property ? property.toJSON() : null,
      agreement: agreement ? agreement.toJSON() : null
    };
  }

  /**
   * Delete tenant profile (admin only)
   */
  deleteTenant(id, requestingUserRole) {
    if (requestingUserRole !== 'admin') {
      throw new Error('Only admins can delete tenant profiles');
    }

    const tenant = dataStore.getTenantById(id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    if (tenant.hasActiveRental()) {
      throw new Error('Cannot delete tenant with active rental');
    }

    dataStore.deleteTenant(id);
    return { message: 'Tenant profile deleted successfully' };
  }

  /**
   * Get tenant statistics
   */
  getTenantStatistics() {
    const tenants = dataStore.getAllTenants();
    
    return {
      total: tenants.length,
      withActiveRentals: tenants.filter(t => t.hasActiveRental()).length,
      withoutRentals: tenants.filter(t => !t.hasActiveRental()).length,
      employmentStatus: {
        employed: tenants.filter(t => t.employmentStatus === 'employed').length,
        selfEmployed: tenants.filter(t => t.employmentStatus === 'self-employed').length,
        unemployed: tenants.filter(t => t.employmentStatus === 'unemployed').length,
        retired: tenants.filter(t => t.employmentStatus === 'retired').length,
        student: tenants.filter(t => t.employmentStatus === 'student').length
      }
    };
  }

  /**
   * Search tenants
   */
  searchTenants(filters) {
    let results = dataStore.getAllTenants();

    if (filters.employmentStatus) {
      results = results.filter(t => t.employmentStatus === filters.employmentStatus);
    }
    if (filters.minIncome) {
      results = results.filter(t => t.annualIncome >= filters.minIncome);
    }
    if (filters.maxIncome) {
      results = results.filter(t => t.annualIncome <= filters.maxIncome);
    }
    if (filters.hasActiveRental !== undefined) {
      results = results.filter(t => t.hasActiveRental() === filters.hasActiveRental);
    }

    return results.map(t => t.toJSON());
  }
}

module.exports = new TenantService();
