const { Property } = require('../models');
const dataStore = require('../utils/dataStore');

/**
 * PropertyService handles all property-related operations
 */
class PropertyService {
  /**
   * Create a new property listing
   */
  createProperty(propertyData) {
    const property = new Property(propertyData);
    dataStore.createProperty(property);
    return property.toJSON();
  }

  /**
   * Get property by ID
   */
  getPropertyById(id) {
    const property = dataStore.getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }
    return property.toJSON();
  }

  /**
   * Get all properties
   */
  getAllProperties() {
    return dataStore.getAllProperties().map(p => p.toJSON());
  }

  /**
   * Get properties by owner
   */
  getPropertiesByOwner(ownerId) {
    return dataStore.getPropertiesByOwner(ownerId).map(p => p.toJSON());
  }

  /**
   * Get available properties
   */
  getAvailableProperties() {
    return dataStore.getAvailableProperties().map(p => p.toJSON());
  }

  /**
   * Search properties with filters
   */
  searchProperties(filters) {
    return dataStore.searchProperties(filters).map(p => p.toJSON());
  }

  /**
   * Update property
   */
  updateProperty(id, updates, requestingUserId, requestingUserRole) {
    const property = dataStore.getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Only owner or admin can update
    if (property.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to update this property');
    }

    const updatedProperty = dataStore.updateProperty(id, updates);
    return updatedProperty.toJSON();
  }

  /**
   * Update property status
   */
  updatePropertyStatus(id, status, requestingUserId, requestingUserRole) {
    const property = dataStore.getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Only owner or admin can update status
    if (property.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to update this property');
    }

    property.updateStatus(status);
    return property.toJSON();
  }

  /**
   * Delete property
   */
  deleteProperty(id, requestingUserId, requestingUserRole) {
    const property = dataStore.getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Only owner or admin can delete
    if (property.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to delete this property');
    }

    // Check if property has active rentals
    const activeAgreements = dataStore.getRentalAgreementsByProperty(id)
      .filter(a => a.status === 'active');
    if (activeAgreements.length > 0) {
      throw new Error('Cannot delete property with active rental agreements');
    }

    dataStore.deleteProperty(id);
    return { message: 'Property deleted successfully' };
  }

  /**
   * Get property statistics
   */
  getPropertyStatistics(ownerId = null) {
    let properties = ownerId 
      ? dataStore.getPropertiesByOwner(ownerId) 
      : dataStore.getAllProperties();

    return {
      total: properties.length,
      available: properties.filter(p => p.status === 'available').length,
      rented: properties.filter(p => p.status === 'rented').length,
      sold: properties.filter(p => p.status === 'sold').length,
      maintenance: properties.filter(p => p.status === 'maintenance').length,
      forRent: properties.filter(p => p.rentOrSale === 'rent').length,
      forSale: properties.filter(p => p.rentOrSale === 'sale').length,
      averagePrice: properties.length > 0 
        ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length 
        : 0
    };
  }

  /**
   * Add amenity to property
   */
  addAmenity(id, amenity, requestingUserId, requestingUserRole) {
    const property = dataStore.getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to update this property');
    }

    if (!property.amenities.includes(amenity)) {
      property.amenities.push(amenity);
      property.updatedAt = new Date().toISOString();
    }
    
    return property.toJSON();
  }

  /**
   * Add image to property
   */
  addImage(id, imageUrl, requestingUserId, requestingUserRole) {
    const property = dataStore.getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
      throw new Error('Not authorized to update this property');
    }

    property.images.push(imageUrl);
    property.updatedAt = new Date().toISOString();
    
    return property.toJSON();
  }
}

module.exports = new PropertyService();
