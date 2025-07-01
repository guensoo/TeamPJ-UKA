package com.teamProject.UKA.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.teamProject.UKA.auth.model.PasswordResetToken;
import com.teamProject.UKA.auth.model.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    
    // 변경 쿼리임을 명시
    @Modifying
    @Query("delete from PasswordResetToken p where p.user = :userId")
    void deleteByUser(@Param("userId") User userId);
}