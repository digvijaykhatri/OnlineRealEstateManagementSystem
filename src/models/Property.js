const { v4: uuidv4 } = require('uuid');

/**
 * Property model for the Real Estate Management System
 * Represents a property listing that can be rented or sold
 */
class Property {
  constructor({
    id,
    title,
    description,
    address,
    city,
    state,
    zipCode,
    propertyType,
    bedrooms,
    bathrooms,
    squareFeet,
    price,
    rentOrSale,
    status,
    ownerId,
    amenities,
    images,
    createdAt,
    updatedAt
  }) {
    this.id = id || uuidv4();
    this.title = title;
    this.description = description || '';
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.propertyType = propertyType || 'apartment'; // apartment, house, condo, townhouse, commercial
    this.bedrooms = bedrooms || 0;
    this.bathrooms = bathrooms || 0;
    this.squareFeet = squareFeet || 0;
    this.price = price;
    this.rentOrSale = rentOrSale || 'rent'; // rent, sale
    this.status = status || 'available'; // available, rented, sold, maintenance
    this.ownerId = ownerId;
    this.amenities = amenities || [];
    this.images = images || [];
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Check if property is available
   */
  isAvailable() {
    return this.status === 'available';
  }

  /**
   * Update property status
   */
  updateStatus(newStatus) {
    const validStatuses = ['available', 'rented', 'sold', 'maintenance'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Get property summary
   */
  getSummary() {
    return {
      id: this.id,
      title: this.title,
      address: this.address,
      city: this.city,
      price: this.price,
      status: this.status,
      rentOrSale: this.rentOrSale
    };
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      propertyType: this.propertyType,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      squareFeet: this.squareFeet,
      price: this.price,
      rentOrSale: this.rentOrSale,
      status: this.status,
      ownerId: this.ownerId,
      amenities: this.amenities,
      images: this.images,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Property;
