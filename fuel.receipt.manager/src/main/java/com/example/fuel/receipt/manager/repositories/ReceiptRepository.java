package com.example.fuel.receipt.manager.repositories;

import com.example.fuel.receipt.manager.entities.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {
    List<Receipt> findByUserIdOrderByDateDesc(UUID userId);

    @Query("SELECT r FROM Receipt r WHERE r.user.id = :userId AND YEAR(r.date) = :year AND MONTH(r.date) = :month")
    List<Receipt> findByUserIdAndYearAndMonth(@Param("userId") UUID userId, @Param("year") int year, @Param("month") int month);
}
