package com.teamProject.UKA.board.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.teamProject.UKA.board.model.BoardReport;

@Repository
public interface BoardReportRepository extends JpaRepository<BoardReport, Long>{

	Optional<BoardReport> findByPostIdAndUserId(String postId, String userId);
    long countByPostId(String postId);
    boolean existsByPostIdAndUserId(String postId, String userId);
}
