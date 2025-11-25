package com.realestate.management.controller;

import com.realestate.management.model.Property;
import com.realestate.management.model.PropertyStatus;
import com.realestate.management.model.PropertyType;
import com.realestate.management.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST controller for managing properties.
 */
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(@Valid @RequestBody Property property) {
        Property createdProperty = propertyService.createProperty(property);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id)
                .map(property -> new ResponseEntity<>(property, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Property>> getAvailableProperties() {
        List<Property> properties = propertyService.getAvailableProperties();
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Property>> getPropertiesByStatus(@PathVariable PropertyStatus status) {
        List<Property> properties = propertyService.getPropertiesByStatus(status);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable PropertyType type) {
        List<Property> properties = propertyService.getPropertiesByType(type);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Property>> getPropertiesByCity(@PathVariable String city) {
        List<Property> properties = propertyService.getPropertiesByCity(city);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/city/{city}/available")
    public ResponseEntity<List<Property>> getAvailablePropertiesByCity(@PathVariable String city) {
        List<Property> properties = propertyService.getAvailablePropertiesByCity(city);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/price")
    public ResponseEntity<List<Property>> getPropertiesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<Property> properties = propertyService.getPropertiesByPriceRange(minPrice, maxPrice);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/bedrooms")
    public ResponseEntity<List<Property>> getPropertiesByMinBedrooms(@RequestParam Integer minBedrooms) {
        List<Property> properties = propertyService.getPropertiesByMinBedrooms(minBedrooms);
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @Valid @RequestBody Property property) {
        try {
            Property updatedProperty = propertyService.updateProperty(id, property);
            return new ResponseEntity<>(updatedProperty, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Property> updatePropertyStatus(
            @PathVariable Long id,
            @RequestParam PropertyStatus status) {
        try {
            Property property = propertyService.updatePropertyStatus(id, status);
            return new ResponseEntity<>(property, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        try {
            propertyService.deleteProperty(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
