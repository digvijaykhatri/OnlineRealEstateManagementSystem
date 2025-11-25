package com.realestate.management.service;

import com.realestate.management.model.Property;
import com.realestate.management.model.PropertyStatus;
import com.realestate.management.model.PropertyType;
import com.realestate.management.model.User;
import com.realestate.management.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing properties.
 */
@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> getPropertiesByOwner(User owner) {
        return propertyRepository.findByOwner(owner);
    }

    public List<Property> getPropertiesByStatus(PropertyStatus status) {
        return propertyRepository.findByStatus(status);
    }

    public List<Property> getAvailableProperties() {
        return propertyRepository.findByStatus(PropertyStatus.AVAILABLE);
    }

    public List<Property> getPropertiesByType(PropertyType type) {
        return propertyRepository.findByPropertyType(type);
    }

    public List<Property> getPropertiesByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    public List<Property> getAvailablePropertiesByCity(String city) {
        return propertyRepository.findByCityAndStatus(city, PropertyStatus.AVAILABLE);
    }

    public List<Property> getPropertiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return propertyRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Property> getPropertiesByMinBedrooms(Integer minBedrooms) {
        return propertyRepository.findByBedroomsGreaterThanEqual(minBedrooms);
    }

    public Property updateProperty(Long id, Property updatedProperty) {
        return propertyRepository.findById(id)
                .map(property -> {
                    property.setTitle(updatedProperty.getTitle());
                    property.setDescription(updatedProperty.getDescription());
                    property.setAddress(updatedProperty.getAddress());
                    property.setCity(updatedProperty.getCity());
                    property.setState(updatedProperty.getState());
                    property.setZipCode(updatedProperty.getZipCode());
                    property.setPropertyType(updatedProperty.getPropertyType());
                    property.setPrice(updatedProperty.getPrice());
                    property.setBedrooms(updatedProperty.getBedrooms());
                    property.setBathrooms(updatedProperty.getBathrooms());
                    property.setSquareFeet(updatedProperty.getSquareFeet());
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + id));
    }

    public Property updatePropertyStatus(Long id, PropertyStatus status) {
        return propertyRepository.findById(id)
                .map(property -> {
                    property.setStatus(status);
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + id));
    }

    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new IllegalArgumentException("Property not found with id: " + id);
        }
        propertyRepository.deleteById(id);
    }
}
