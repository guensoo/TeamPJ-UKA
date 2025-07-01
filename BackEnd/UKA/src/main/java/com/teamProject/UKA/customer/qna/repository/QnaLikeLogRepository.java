package com.teamProject.UKA.customer.qna.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamProject.UKA.customer.qna.entity.QnaLikeLog;

public interface QnaLikeLogRepository extends JpaRepository<QnaLikeLog, Long> {
    // 1인 1추천 체크
    boolean existsByQnaNoAndUserId(Long qnaNo, String userId);

    // 특정 QnA의 추천 총 개수
    long countByQnaNo(Long qnaNo);
    
    Optional<QnaLikeLog> findByQnaNoAndUserId(Long qnaNo, String userId);
}
