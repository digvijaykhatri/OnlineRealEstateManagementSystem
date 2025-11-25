const { propertyService } = require('../services');

/**
 * Property controller handles HTTP requests for property operations
 */
const propertyController = {
  /**
   * Create a new property
   */
  createProperty(req, res, next) {
    try {
      const propertyData = {
        ...req.body,
        ownerId: req.user.id
      };
      const property = propertyService.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get property by ID
   */
  getPropertyById(req, res, next) {
    try {
      const property = propertyService.getPropertyById(req.params.id);
      res.json(property);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all properties
   */
  getAllProperties(req, res, next) {
    try {
      const properties = propertyService.getAllProperties();
      res.json(properties);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get properties by owner
   */
  getPropertiesByOwner(req, res, next) {
    try {
      const ownerId = req.params.ownerId || req.user.id;
      const properties = propertyService.getPropertiesByOwner(ownerId);
      res.json(properties);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get available properties
   */
  getAvailableProperties(req, res, next) {
    try {
      const properties = propertyService.getAvailableProperties();
      res.json(properties);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Search properties
   */
  searchProperties(req, res, next) {
    try {
      const filters = {
        city: req.query.city,
        state: req.query.state,
        propertyType: req.query.propertyType,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
        rentOrSale: req.query.rentOrSale,
        status: req.query.status
      };
      const properties = propertyService.searchProperties(filters);
      res.json(properties);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update property
   */
  updateProperty(req, res, next) {
    try {
      const property = propertyService.updateProperty(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(property);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update property status
   */
  updatePropertyStatus(req, res, next) {
    try {
      const property = propertyService.updatePropertyStatus(
        req.params.id,
        req.body.status,
        req.user.id,
        req.user.role
      );
      res.json(property);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete property
   */
  deleteProperty(req, res, next) {
    try {
      const result = propertyService.deleteProperty(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get property statistics
   */
  getPropertyStatistics(req, res, next) {
    try {
      const ownerId = req.user.role === 'admin' ? null : req.user.id;
      const stats = propertyService.getPropertyStatistics(ownerId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add amenity to property
   */
  addAmenity(req, res, next) {
    try {
      const property = propertyService.addAmenity(
        req.params.id,
        req.body.amenity,
        req.user.id,
        req.user.role
      );
      res.json(property);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add image to property
   */
  addImage(req, res, next) {
    try {
      const property = propertyService.addImage(
        req.params.id,
        req.body.imageUrl,
        req.user.id,
        req.user.role
      );
      res.json(property);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = propertyController;
