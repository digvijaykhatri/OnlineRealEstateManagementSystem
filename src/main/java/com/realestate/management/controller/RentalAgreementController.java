package com.realestate.management.controller;

import com.realestate.management.model.AgreementStatus;
import com.realestate.management.model.RentalAgreement;
import com.realestate.management.service.RentalAgreementService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for managing rental agreements.
 */
@RestController
@RequestMapping("/api/rental-agreements")
public class RentalAgreementController {

    private final RentalAgreementService rentalAgreementService;

    public RentalAgreementController(RentalAgreementService rentalAgreementService) {
        this.rentalAgreementService = rentalAgreementService;
    }

    @PostMapping
    public ResponseEntity<RentalAgreement> createRentalAgreement(@Valid @RequestBody RentalAgreement agreement) {
        try {
            RentalAgreement createdAgreement = rentalAgreementService.createRentalAgreement(agreement);
            return new ResponseEntity<>(createdAgreement, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalAgreement> getRentalAgreementById(@PathVariable Long id) {
        return rentalAgreementService.getRentalAgreementById(id)
                .map(agreement -> new ResponseEntity<>(agreement, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<RentalAgreement>> getAllRentalAgreements() {
        List<RentalAgreement> agreements = rentalAgreementService.getAllRentalAgreements();
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<RentalAgreement>> getRentalAgreementsByPropertyId(@PathVariable Long propertyId) {
        List<RentalAgreement> agreements = rentalAgreementService.getRentalAgreementsByPropertyId(propertyId);
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<RentalAgreement>> getRentalAgreementsByTenantId(@PathVariable Long tenantId) {
        List<RentalAgreement> agreements = rentalAgreementService.getRentalAgreementsByTenantId(tenantId);
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RentalAgreement>> getRentalAgreementsByStatus(@PathVariable AgreementStatus status) {
        List<RentalAgreement> agreements = rentalAgreementService.getRentalAgreementsByStatus(status);
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RentalAgreement>> getActiveAgreements() {
        List<RentalAgreement> agreements = rentalAgreementService.getActiveAgreements();
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/expired")
    public ResponseEntity<List<RentalAgreement>> getExpiredAgreements() {
        List<RentalAgreement> agreements = rentalAgreementService.getExpiredAgreements();
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<RentalAgreement>> getAgreementsExpiringBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<RentalAgreement> agreements = rentalAgreementService.getAgreementsExpiringBetween(startDate, endDate);
        return new ResponseEntity<>(agreements, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalAgreement> updateRentalAgreement(
            @PathVariable Long id,
            @Valid @RequestBody RentalAgreement agreement) {
        try {
            RentalAgreement updatedAgreement = rentalAgreementService.updateRentalAgreement(id, agreement);
            return new ResponseEntity<>(updatedAgreement, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<RentalAgreement> activateAgreement(@PathVariable Long id) {
        try {
            RentalAgreement agreement = rentalAgreementService.activateAgreement(id);
            return new ResponseEntity<>(agreement, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/terminate")
    public ResponseEntity<RentalAgreement> terminateAgreement(@PathVariable Long id) {
        try {
            RentalAgreement agreement = rentalAgreementService.terminateAgreement(id);
            return new ResponseEntity<>(agreement, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/expire")
    public ResponseEntity<RentalAgreement> expireAgreement(@PathVariable Long id) {
        try {
            RentalAgreement agreement = rentalAgreementService.expireAgreement(id);
            return new ResponseEntity<>(agreement, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentalAgreement(@PathVariable Long id) {
        try {
            rentalAgreementService.deleteRentalAgreement(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
