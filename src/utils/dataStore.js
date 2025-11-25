/**
 * In-memory data store for the Real Estate Management System
 * This can be replaced with a database in production
 */
class DataStore {
  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.rentalAgreements = new Map();
    this.tenants = new Map();
  }

  // User operations
  createUser(user) {
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id) {
    return this.users.get(id);
  }

  getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return user;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }

  // Property operations
  createProperty(property) {
    this.properties.set(property.id, property);
    return property;
  }

  getPropertyById(id) {
    return this.properties.get(id);
  }

  getAllProperties() {
    return Array.from(this.properties.values());
  }

  getPropertiesByOwner(ownerId) {
    return Array.from(this.properties.values()).filter(p => p.ownerId === ownerId);
  }

  getAvailableProperties() {
    return Array.from(this.properties.values()).filter(p => p.status === 'available');
  }

  searchProperties(filters) {
    let results = Array.from(this.properties.values());

    if (filters.city) {
      results = results.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.state) {
      results = results.filter(p => p.state.toLowerCase().includes(filters.state.toLowerCase()));
    }
    if (filters.propertyType) {
      results = results.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.bedrooms) {
      results = results.filter(p => p.bedrooms >= filters.bedrooms);
    }
    if (filters.rentOrSale) {
      results = results.filter(p => p.rentOrSale === filters.rentOrSale);
    }
    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }

    return results;
  }

  updateProperty(id, updates) {
    const property = this.properties.get(id);
    if (!property) return null;
    Object.assign(property, updates, { updatedAt: new Date().toISOString() });
    return property;
  }

  deleteProperty(id) {
    return this.properties.delete(id);
  }

  // Rental Agreement operations
  createRentalAgreement(agreement) {
    this.rentalAgreements.set(agreement.id, agreement);
    return agreement;
  }

  getRentalAgreementById(id) {
    return this.rentalAgreements.get(id);
  }

  getAllRentalAgreements() {
    return Array.from(this.rentalAgreements.values());
  }

  getRentalAgreementsByTenant(tenantId) {
    return Array.from(this.rentalAgreements.values()).filter(a => a.tenantId === tenantId);
  }

  getRentalAgreementsByLandlord(landlordId) {
    return Array.from(this.rentalAgreements.values()).filter(a => a.landlordId === landlordId);
  }

  getRentalAgreementsByProperty(propertyId) {
    return Array.from(this.rentalAgreements.values()).filter(a => a.propertyId === propertyId);
  }

  getActiveRentalAgreements() {
    return Array.from(this.rentalAgreements.values()).filter(a => a.status === 'active');
  }

  updateRentalAgreement(id, updates) {
    const agreement = this.rentalAgreements.get(id);
    if (!agreement) return null;
    Object.assign(agreement, updates, { updatedAt: new Date().toISOString() });
    return agreement;
  }

  deleteRentalAgreement(id) {
    return this.rentalAgreements.delete(id);
  }

  // Tenant operations
  createTenant(tenant) {
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  getTenantById(id) {
    return this.tenants.get(id);
  }

  getTenantByUserId(userId) {
    for (const tenant of this.tenants.values()) {
      if (tenant.userId === userId) {
        return tenant;
      }
    }
    return null;
  }

  getAllTenants() {
    return Array.from(this.tenants.values());
  }

  updateTenant(id, updates) {
    const tenant = this.tenants.get(id);
    if (!tenant) return null;
    Object.assign(tenant, updates, { updatedAt: new Date().toISOString() });
    return tenant;
  }

  deleteTenant(id) {
    return this.tenants.delete(id);
  }

  // Statistics for admin dashboard
  getStatistics() {
    const users = this.getAllUsers();
    const properties = this.getAllProperties();
    const agreements = this.getAllRentalAgreements();

    return {
      totalUsers: users.length,
      usersByRole: {
        admins: users.filter(u => u.role === 'admin').length,
        landlords: users.filter(u => u.role === 'landlord').length,
        tenants: users.filter(u => u.role === 'tenant').length,
        agents: users.filter(u => u.role === 'agent').length
      },
      totalProperties: properties.length,
      propertiesByStatus: {
        available: properties.filter(p => p.status === 'available').length,
        rented: properties.filter(p => p.status === 'rented').length,
        sold: properties.filter(p => p.status === 'sold').length,
        maintenance: properties.filter(p => p.status === 'maintenance').length
      },
      propertiesByType: {
        rent: properties.filter(p => p.rentOrSale === 'rent').length,
        sale: properties.filter(p => p.rentOrSale === 'sale').length
      },
      totalAgreements: agreements.length,
      agreementsByStatus: {
        draft: agreements.filter(a => a.status === 'draft').length,
        pending: agreements.filter(a => a.status === 'pending').length,
        active: agreements.filter(a => a.status === 'active').length,
        expired: agreements.filter(a => a.status === 'expired').length,
        terminated: agreements.filter(a => a.status === 'terminated').length
      },
      totalRevenue: agreements
        .filter(a => a.status === 'active')
        .reduce((sum, a) => sum + a.monthlyRent, 0)
    };
  }

  // Clear all data (useful for testing)
  clear() {
    this.users.clear();
    this.properties.clear();
    this.rentalAgreements.clear();
    this.tenants.clear();
  }
}

// Singleton instance
const dataStore = new DataStore();

module.exports = dataStore;
