package com.realestate.management.repository;

import com.realestate.management.model.Property;
import com.realestate.management.model.PropertyStatus;
import com.realestate.management.model.PropertyType;
import com.realestate.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository interface for Property entity.
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByOwner(User owner);

    List<Property> findByStatus(PropertyStatus status);

    List<Property> findByPropertyType(PropertyType propertyType);

    List<Property> findByCity(String city);

    List<Property> findByCityAndStatus(String city, PropertyStatus status);

    List<Property> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Property> findByBedroomsGreaterThanEqual(Integer bedrooms);

    List<Property> findByStatusAndPropertyType(PropertyStatus status, PropertyType propertyType);
}
