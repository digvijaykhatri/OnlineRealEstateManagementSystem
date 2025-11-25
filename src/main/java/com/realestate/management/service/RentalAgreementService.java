package com.realestate.management.service;

import com.realestate.management.model.*;
import com.realestate.management.repository.RentalAgreementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing rental agreements.
 */
@Service
@Transactional
public class RentalAgreementService {

    private final RentalAgreementRepository rentalAgreementRepository;
    private final PropertyService propertyService;

    public RentalAgreementService(RentalAgreementRepository rentalAgreementRepository,
                                   PropertyService propertyService) {
        this.rentalAgreementRepository = rentalAgreementRepository;
        this.propertyService = propertyService;
    }

    public RentalAgreement createRentalAgreement(RentalAgreement agreement) {
        validateAgreementDates(agreement);
        return rentalAgreementRepository.save(agreement);
    }

    public Optional<RentalAgreement> getRentalAgreementById(Long id) {
        return rentalAgreementRepository.findById(id);
    }

    public List<RentalAgreement> getAllRentalAgreements() {
        return rentalAgreementRepository.findAll();
    }

    public List<RentalAgreement> getRentalAgreementsByProperty(Property property) {
        return rentalAgreementRepository.findByProperty(property);
    }

    public List<RentalAgreement> getRentalAgreementsByPropertyId(Long propertyId) {
        return rentalAgreementRepository.findByPropertyId(propertyId);
    }

    public List<RentalAgreement> getRentalAgreementsByTenant(Tenant tenant) {
        return rentalAgreementRepository.findByTenant(tenant);
    }

    public List<RentalAgreement> getRentalAgreementsByTenantId(Long tenantId) {
        return rentalAgreementRepository.findByTenantId(tenantId);
    }

    public List<RentalAgreement> getRentalAgreementsByStatus(AgreementStatus status) {
        return rentalAgreementRepository.findByStatus(status);
    }

    public List<RentalAgreement> getActiveAgreements() {
        return rentalAgreementRepository.findByStatus(AgreementStatus.ACTIVE);
    }

    public List<RentalAgreement> getExpiredAgreements() {
        return rentalAgreementRepository.findByEndDateBefore(LocalDate.now());
    }

    public List<RentalAgreement> getAgreementsExpiringBetween(LocalDate startDate, LocalDate endDate) {
        return rentalAgreementRepository.findByEndDateBetween(startDate, endDate);
    }

    public RentalAgreement updateRentalAgreement(Long id, RentalAgreement updatedAgreement) {
        validateAgreementDates(updatedAgreement);
        return rentalAgreementRepository.findById(id)
                .map(agreement -> {
                    agreement.setStartDate(updatedAgreement.getStartDate());
                    agreement.setEndDate(updatedAgreement.getEndDate());
                    agreement.setMonthlyRent(updatedAgreement.getMonthlyRent());
                    agreement.setSecurityDeposit(updatedAgreement.getSecurityDeposit());
                    agreement.setTerms(updatedAgreement.getTerms());
                    return rentalAgreementRepository.save(agreement);
                })
                .orElseThrow(() -> new IllegalArgumentException("Rental agreement not found with id: " + id));
    }

    public RentalAgreement activateAgreement(Long id) {
        return rentalAgreementRepository.findById(id)
                .map(agreement -> {
                    agreement.setStatus(AgreementStatus.ACTIVE);
                    // Update property status to RENTED
                    propertyService.updatePropertyStatus(agreement.getProperty().getId(), PropertyStatus.RENTED);
                    return rentalAgreementRepository.save(agreement);
                })
                .orElseThrow(() -> new IllegalArgumentException("Rental agreement not found with id: " + id));
    }

    public RentalAgreement terminateAgreement(Long id) {
        return rentalAgreementRepository.findById(id)
                .map(agreement -> {
                    agreement.setStatus(AgreementStatus.TERMINATED);
                    // Update property status to AVAILABLE
                    propertyService.updatePropertyStatus(agreement.getProperty().getId(), PropertyStatus.AVAILABLE);
                    return rentalAgreementRepository.save(agreement);
                })
                .orElseThrow(() -> new IllegalArgumentException("Rental agreement not found with id: " + id));
    }

    public RentalAgreement expireAgreement(Long id) {
        return rentalAgreementRepository.findById(id)
                .map(agreement -> {
                    agreement.setStatus(AgreementStatus.EXPIRED);
                    // Update property status to AVAILABLE
                    propertyService.updatePropertyStatus(agreement.getProperty().getId(), PropertyStatus.AVAILABLE);
                    return rentalAgreementRepository.save(agreement);
                })
                .orElseThrow(() -> new IllegalArgumentException("Rental agreement not found with id: " + id));
    }

    public void deleteRentalAgreement(Long id) {
        if (!rentalAgreementRepository.existsById(id)) {
            throw new IllegalArgumentException("Rental agreement not found with id: " + id);
        }
        rentalAgreementRepository.deleteById(id);
    }

    private void validateAgreementDates(RentalAgreement agreement) {
        if (agreement.getEndDate().isBefore(agreement.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
    }
}
