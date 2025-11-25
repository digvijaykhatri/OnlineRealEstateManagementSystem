package com.realestate.management.repository;

import com.realestate.management.model.Tenant;
import com.realestate.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Tenant entity.
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    Optional<Tenant> findByUser(User user);

    Optional<Tenant> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
