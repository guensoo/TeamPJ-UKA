package com.teamProject.UKA.customer.qna.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamProject.UKA.customer.qna.entity.QnaReportLog;

public interface QnaReportLogRepository extends JpaRepository<QnaReportLog, Long> {
    boolean existsByQnaNoAndUserId(Long qnaNo, String userId);
    long countByQnaNo(Long qnaNo);
}
