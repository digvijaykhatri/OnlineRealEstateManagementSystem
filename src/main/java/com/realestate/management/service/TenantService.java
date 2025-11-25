package com.realestate.management.service;

import com.realestate.management.model.Tenant;
import com.realestate.management.model.User;
import com.realestate.management.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing tenants.
 */
@Service
@Transactional
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public Tenant createTenant(Tenant tenant) {
        if (tenantRepository.existsByUserId(tenant.getUser().getId())) {
            throw new IllegalArgumentException("Tenant profile already exists for this user");
        }
        return tenantRepository.save(tenant);
    }

    public Optional<Tenant> getTenantById(Long id) {
        return tenantRepository.findById(id);
    }

    public Optional<Tenant> getTenantByUser(User user) {
        return tenantRepository.findByUser(user);
    }

    public Optional<Tenant> getTenantByUserId(Long userId) {
        return tenantRepository.findByUserId(userId);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant updateTenant(Long id, Tenant updatedTenant) {
        return tenantRepository.findById(id)
                .map(tenant -> {
                    tenant.setEmergencyContactName(updatedTenant.getEmergencyContactName());
                    tenant.setEmergencyContactPhone(updatedTenant.getEmergencyContactPhone());
                    tenant.setEmployerName(updatedTenant.getEmployerName());
                    tenant.setEmployerPhone(updatedTenant.getEmployerPhone());
                    tenant.setNotes(updatedTenant.getNotes());
                    return tenantRepository.save(tenant);
                })
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with id: " + id));
    }

    public void deleteTenant(Long id) {
        if (!tenantRepository.existsById(id)) {
            throw new IllegalArgumentException("Tenant not found with id: " + id);
        }
        tenantRepository.deleteById(id);
    }
}
