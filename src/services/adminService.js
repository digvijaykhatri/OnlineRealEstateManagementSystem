const dataStore = require('../utils/dataStore');

/**
 * AdminService handles system oversight and administrative operations
 */
class AdminService {
  /**
   * Get system-wide statistics dashboard
   */
  getDashboard() {
    return dataStore.getStatistics();
  }

  /**
   * Get detailed user report
   */
  getUserReport() {
    const users = dataStore.getAllUsers();
    
    return {
      totalUsers: users.length,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').map(u => u.toJSON()),
        landlord: users.filter(u => u.role === 'landlord').map(u => u.toJSON()),
        tenant: users.filter(u => u.role === 'tenant').map(u => u.toJSON()),
        agent: users.filter(u => u.role === 'agent').map(u => u.toJSON())
      },
      recentUsers: users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(u => u.toJSON())
    };
  }

  /**
   * Get property report
   */
  getPropertyReport() {
    const properties = dataStore.getAllProperties();
    
    return {
      totalProperties: properties.length,
      byStatus: {
        available: properties.filter(p => p.status === 'available').length,
        rented: properties.filter(p => p.status === 'rented').length,
        sold: properties.filter(p => p.status === 'sold').length,
        maintenance: properties.filter(p => p.status === 'maintenance').length
      },
      byType: {
        apartment: properties.filter(p => p.propertyType === 'apartment').length,
        house: properties.filter(p => p.propertyType === 'house').length,
        condo: properties.filter(p => p.propertyType === 'condo').length,
        townhouse: properties.filter(p => p.propertyType === 'townhouse').length,
        commercial: properties.filter(p => p.propertyType === 'commercial').length
      },
      byListingType: {
        rent: properties.filter(p => p.rentOrSale === 'rent').length,
        sale: properties.filter(p => p.rentOrSale === 'sale').length
      },
      averagePrice: properties.length > 0 
        ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length 
        : 0,
      averageRentPrice: (() => {
        const rentals = properties.filter(p => p.rentOrSale === 'rent');
        return rentals.length > 0 
          ? rentals.reduce((sum, p) => sum + p.price, 0) / rentals.length 
          : 0;
      })(),
      averageSalePrice: (() => {
        const sales = properties.filter(p => p.rentOrSale === 'sale');
        return sales.length > 0 
          ? sales.reduce((sum, p) => sum + p.price, 0) / sales.length 
          : 0;
      })()
    };
  }

  /**
   * Get rental agreement report
   */
  getRentalAgreementReport() {
    const agreements = dataStore.getAllRentalAgreements();
    const activeAgreements = agreements.filter(a => a.status === 'active');
    
    return {
      totalAgreements: agreements.length,
      byStatus: {
        draft: agreements.filter(a => a.status === 'draft').length,
        pending: agreements.filter(a => a.status === 'pending').length,
        active: activeAgreements.length,
        expired: agreements.filter(a => a.status === 'expired').length,
        terminated: agreements.filter(a => a.status === 'terminated').length
      },
      financials: {
        totalMonthlyRevenue: activeAgreements.reduce((sum, a) => sum + a.monthlyRent, 0),
        averageMonthlyRent: activeAgreements.length > 0 
          ? activeAgreements.reduce((sum, a) => sum + a.monthlyRent, 0) / activeAgreements.length 
          : 0,
        totalSecurityDeposits: activeAgreements.reduce((sum, a) => sum + a.securityDeposit, 0)
      },
      recentAgreements: agreements
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(a => a.toJSON())
    };
  }

  /**
   * Get tenant report
   */
  getTenantReport() {
    const tenants = dataStore.getAllTenants();
    
    return {
      totalTenants: tenants.length,
      withActiveRentals: tenants.filter(t => t.hasActiveRental()).length,
      withoutRentals: tenants.filter(t => !t.hasActiveRental()).length,
      byEmploymentStatus: {
        employed: tenants.filter(t => t.employmentStatus === 'employed').length,
        selfEmployed: tenants.filter(t => t.employmentStatus === 'self-employed').length,
        unemployed: tenants.filter(t => t.employmentStatus === 'unemployed').length,
        retired: tenants.filter(t => t.employmentStatus === 'retired').length,
        student: tenants.filter(t => t.employmentStatus === 'student').length
      },
      averageIncome: (() => {
        const tenantsWithIncome = tenants.filter(t => t.annualIncome > 0);
        return tenantsWithIncome.length > 0 
          ? tenantsWithIncome.reduce((sum, t) => sum + t.annualIncome, 0) / tenantsWithIncome.length 
          : 0;
      })()
    };
  }

  /**
   * Get system activity log (simplified version)
   */
  getActivitySummary() {
    const users = dataStore.getAllUsers();
    const properties = dataStore.getAllProperties();
    const agreements = dataStore.getAllRentalAgreements();

    // Get recent activities based on timestamps
    const recentUsers = users
      .filter(u => {
        const created = new Date(u.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created > weekAgo;
      })
      .length;

    const recentProperties = properties
      .filter(p => {
        const created = new Date(p.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created > weekAgo;
      })
      .length;

    const recentAgreements = agreements
      .filter(a => {
        const created = new Date(a.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created > weekAgo;
      })
      .length;

    return {
      lastWeek: {
        newUsers: recentUsers,
        newProperties: recentProperties,
        newAgreements: recentAgreements
      },
      totals: {
        users: users.length,
        properties: properties.length,
        agreements: agreements.length
      }
    };
  }

  /**
   * Get comprehensive system report
   */
  getFullReport() {
    return {
      dashboard: this.getDashboard(),
      users: this.getUserReport(),
      properties: this.getPropertyReport(),
      agreements: this.getRentalAgreementReport(),
      tenants: this.getTenantReport(),
      activity: this.getActivitySummary(),
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = new AdminService();
