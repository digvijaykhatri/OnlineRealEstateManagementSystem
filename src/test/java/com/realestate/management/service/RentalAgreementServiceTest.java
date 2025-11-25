package com.realestate.management.service;

import com.realestate.management.model.*;
import com.realestate.management.repository.RentalAgreementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalAgreementServiceTest {

    @Mock
    private RentalAgreementRepository rentalAgreementRepository;

    @Mock
    private PropertyService propertyService;

    @InjectMocks
    private RentalAgreementService rentalAgreementService;

    private RentalAgreement testAgreement;
    private Property testProperty;
    private Tenant testTenant;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("tenant", "tenant@example.com", "password", "Test", "Tenant", UserRole.TENANT);
        testUser.setId(1L);

        testTenant = new Tenant(testUser, "Emergency Contact", "555-1234");
        testTenant.setId(1L);

        User owner = new User("owner", "owner@example.com", "password", "Owner", "Test", UserRole.PROPERTY_OWNER);
        owner.setId(2L);

        testProperty = new Property("Test Property", "123 Main St", "New York", "NY", "10001",
                PropertyType.APARTMENT, new BigDecimal("2000.00"), owner);
        testProperty.setId(1L);

        testAgreement = new RentalAgreement(testProperty, testTenant, LocalDate.now(),
                LocalDate.now().plusYears(1), new BigDecimal("2000.00"), new BigDecimal("4000.00"));
        testAgreement.setId(1L);
    }

    @Test
    void createRentalAgreement_Success() {
        when(rentalAgreementRepository.save(any(RentalAgreement.class))).thenReturn(testAgreement);

        RentalAgreement result = rentalAgreementService.createRentalAgreement(testAgreement);

        assertNotNull(result);
        assertEquals(testProperty, result.getProperty());
        assertEquals(testTenant, result.getTenant());
        verify(rentalAgreementRepository).save(testAgreement);
    }

    @Test
    void createRentalAgreement_InvalidDates_ThrowsException() {
        testAgreement.setEndDate(LocalDate.now().minusDays(1));

        assertThrows(IllegalArgumentException.class,
                () -> rentalAgreementService.createRentalAgreement(testAgreement));
    }

    @Test
    void getRentalAgreementById_Found() {
        when(rentalAgreementRepository.findById(1L)).thenReturn(Optional.of(testAgreement));

        Optional<RentalAgreement> result = rentalAgreementService.getRentalAgreementById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void getRentalAgreementById_NotFound() {
        when(rentalAgreementRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<RentalAgreement> result = rentalAgreementService.getRentalAgreementById(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getActiveAgreements() {
        List<RentalAgreement> agreements = Arrays.asList(testAgreement);
        when(rentalAgreementRepository.findByStatus(AgreementStatus.ACTIVE)).thenReturn(agreements);

        List<RentalAgreement> result = rentalAgreementService.getActiveAgreements();

        assertEquals(1, result.size());
    }

    @Test
    void activateAgreement_Success() {
        when(rentalAgreementRepository.findById(1L)).thenReturn(Optional.of(testAgreement));
        when(rentalAgreementRepository.save(any(RentalAgreement.class))).thenReturn(testAgreement);
        when(propertyService.updatePropertyStatus(1L, PropertyStatus.RENTED)).thenReturn(testProperty);

        RentalAgreement result = rentalAgreementService.activateAgreement(1L);

        assertEquals(AgreementStatus.ACTIVE, result.getStatus());
        verify(propertyService).updatePropertyStatus(1L, PropertyStatus.RENTED);
    }

    @Test
    void terminateAgreement_Success() {
        testAgreement.setStatus(AgreementStatus.ACTIVE);
        when(rentalAgreementRepository.findById(1L)).thenReturn(Optional.of(testAgreement));
        when(rentalAgreementRepository.save(any(RentalAgreement.class))).thenReturn(testAgreement);
        when(propertyService.updatePropertyStatus(1L, PropertyStatus.AVAILABLE)).thenReturn(testProperty);

        RentalAgreement result = rentalAgreementService.terminateAgreement(1L);

        assertEquals(AgreementStatus.TERMINATED, result.getStatus());
        verify(propertyService).updatePropertyStatus(1L, PropertyStatus.AVAILABLE);
    }

    @Test
    void deleteRentalAgreement_Success() {
        when(rentalAgreementRepository.existsById(1L)).thenReturn(true);
        doNothing().when(rentalAgreementRepository).deleteById(1L);

        rentalAgreementService.deleteRentalAgreement(1L);

        verify(rentalAgreementRepository).deleteById(1L);
    }

    @Test
    void deleteRentalAgreement_NotFound() {
        when(rentalAgreementRepository.existsById(1L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> rentalAgreementService.deleteRentalAgreement(1L));
    }
}
