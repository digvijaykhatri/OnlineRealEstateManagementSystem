package com.realestate.management.service;

import com.realestate.management.model.*;
import com.realestate.management.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PropertyService propertyService;

    private Property testProperty;
    private User testOwner;

    @BeforeEach
    void setUp() {
        testOwner = new User("owner", "owner@example.com", "password", "Owner", "Test", UserRole.PROPERTY_OWNER);
        testOwner.setId(1L);

        testProperty = new Property("Nice Apartment", "123 Main St", "New York", "NY", "10001",
                PropertyType.APARTMENT, new BigDecimal("2000.00"), testOwner);
        testProperty.setId(1L);
        testProperty.setBedrooms(2);
        testProperty.setBathrooms(1);
    }

    @Test
    void createProperty_Success() {
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        Property result = propertyService.createProperty(testProperty);

        assertNotNull(result);
        assertEquals("Nice Apartment", result.getTitle());
        verify(propertyRepository).save(testProperty);
    }

    @Test
    void getPropertyById_Found() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        Optional<Property> result = propertyService.getPropertyById(1L);

        assertTrue(result.isPresent());
        assertEquals("Nice Apartment", result.get().getTitle());
    }

    @Test
    void getPropertyById_NotFound() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Property> result = propertyService.getPropertyById(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getAvailableProperties() {
        List<Property> properties = Arrays.asList(testProperty);
        when(propertyRepository.findByStatus(PropertyStatus.AVAILABLE)).thenReturn(properties);

        List<Property> result = propertyService.getAvailableProperties();

        assertEquals(1, result.size());
    }

    @Test
    void getPropertiesByCity() {
        List<Property> properties = Arrays.asList(testProperty);
        when(propertyRepository.findByCity("New York")).thenReturn(properties);

        List<Property> result = propertyService.getPropertiesByCity("New York");

        assertEquals(1, result.size());
        assertEquals("New York", result.get(0).getCity());
    }

    @Test
    void getPropertiesByPriceRange() {
        List<Property> properties = Arrays.asList(testProperty);
        BigDecimal min = new BigDecimal("1000");
        BigDecimal max = new BigDecimal("3000");
        when(propertyRepository.findByPriceBetween(min, max)).thenReturn(properties);

        List<Property> result = propertyService.getPropertiesByPriceRange(min, max);

        assertEquals(1, result.size());
    }

    @Test
    void updatePropertyStatus_Success() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        Property result = propertyService.updatePropertyStatus(1L, PropertyStatus.RENTED);

        assertEquals(PropertyStatus.RENTED, result.getStatus());
    }

    @Test
    void updatePropertyStatus_NotFound() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> propertyService.updatePropertyStatus(1L, PropertyStatus.RENTED));
    }

    @Test
    void deleteProperty_Success() {
        when(propertyRepository.existsById(1L)).thenReturn(true);
        doNothing().when(propertyRepository).deleteById(1L);

        propertyService.deleteProperty(1L);

        verify(propertyRepository).deleteById(1L);
    }

    @Test
    void deleteProperty_NotFound() {
        when(propertyRepository.existsById(1L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> propertyService.deleteProperty(1L));
    }
}
