package com.example.fuel.receipt.manager.repositories;

import com.example.fuel.receipt.manager.entities.AccountantClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccountantClientRepository extends JpaRepository<AccountantClient, UUID> {
    List<AccountantClient> findByAccountantId(UUID accountantId);
    List<AccountantClient> findByCompanyId(UUID companyId);
    boolean existsByAccountantIdAndCompanyId(UUID accountantId, UUID companyId);
    void deleteByAccountantIdAndCompanyId(UUID accountantId, UUID companyId);
}
