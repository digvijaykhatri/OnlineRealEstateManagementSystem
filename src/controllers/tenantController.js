const { tenantService } = require('../services');

/**
 * Tenant controller handles HTTP requests for tenant operations
 */
const tenantController = {
  /**
   * Create a new tenant profile
   */
  createTenant(req, res, next) {
    try {
      const tenantData = {
        ...req.body,
        userId: req.user.id
      };
      const tenant = tenantService.createTenant(tenantData);
      res.status(201).json(tenant);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get tenant by ID
   */
  getTenantById(req, res, next) {
    try {
      const tenant = tenantService.getTenantById(req.params.id);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get tenant profile for current user
   */
  getMyProfile(req, res, next) {
    try {
      const tenant = tenantService.getTenantByUserId(req.user.id);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all tenants (admin/landlord)
   */
  getAllTenants(req, res, next) {
    try {
      const tenants = tenantService.getAllTenants();
      res.json(tenants);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update tenant profile
   */
  updateTenant(req, res, next) {
    try {
      const tenant = tenantService.updateTenant(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update my tenant profile
   */
  updateMyProfile(req, res, next) {
    try {
      const existingTenant = tenantService.getTenantByUserId(req.user.id);
      const tenant = tenantService.updateTenant(
        existingTenant.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add reference to tenant profile
   */
  addReference(req, res, next) {
    try {
      const tenant = tenantService.addReference(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get tenant rental history
   */
  getRentalHistory(req, res, next) {
    try {
      const history = tenantService.getRentalHistory(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.json(history);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current rental information
   */
  getCurrentRental(req, res, next) {
    try {
      const rental = tenantService.getCurrentRental(req.params.id);
      res.json(rental);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete tenant profile (admin only)
   */
  deleteTenant(req, res, next) {
    try {
      const result = tenantService.deleteTenant(req.params.id, req.user.role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get tenant statistics
   */
  getTenantStatistics(req, res, next) {
    try {
      const stats = tenantService.getTenantStatistics();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Search tenants
   */
  searchTenants(req, res, next) {
    try {
      const filters = {
        employmentStatus: req.query.employmentStatus,
        minIncome: req.query.minIncome ? Number(req.query.minIncome) : undefined,
        maxIncome: req.query.maxIncome ? Number(req.query.maxIncome) : undefined,
        hasActiveRental: req.query.hasActiveRental === 'true' ? true : 
                         req.query.hasActiveRental === 'false' ? false : undefined
      };
      const tenants = tenantService.searchTenants(filters);
      res.json(tenants);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tenantController;
