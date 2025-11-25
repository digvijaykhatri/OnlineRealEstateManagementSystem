package com.realestate.management.repository;

import com.realestate.management.model.AgreementStatus;
import com.realestate.management.model.Property;
import com.realestate.management.model.RentalAgreement;
import com.realestate.management.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for RentalAgreement entity.
 */
@Repository
public interface RentalAgreementRepository extends JpaRepository<RentalAgreement, Long> {

    List<RentalAgreement> findByProperty(Property property);

    List<RentalAgreement> findByTenant(Tenant tenant);

    List<RentalAgreement> findByStatus(AgreementStatus status);

    List<RentalAgreement> findByPropertyId(Long propertyId);

    List<RentalAgreement> findByTenantId(Long tenantId);

    List<RentalAgreement> findByEndDateBefore(LocalDate date);

    List<RentalAgreement> findByEndDateBetween(LocalDate startDate, LocalDate endDate);

    List<RentalAgreement> findByPropertyAndStatus(Property property, AgreementStatus status);
}
