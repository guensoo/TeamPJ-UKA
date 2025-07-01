package com.teamProject.UKA.customer.faq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.teamProject.UKA.customer.faq.entity.FaqEntity;

public interface FaqRepository extends JpaRepository<FaqEntity, Long> {
    @Query("SELECT MAX(f.faqId) FROM FaqEntity f WHERE CAST(f.faqId as string) LIKE :datePrefix")
    Long findMaxIdByDate(@Param("datePrefix") String datePrefix); // "250626%"
}
