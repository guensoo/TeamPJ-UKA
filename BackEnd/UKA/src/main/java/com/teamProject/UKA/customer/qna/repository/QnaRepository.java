package com.teamProject.UKA.customer.qna.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.teamProject.UKA.customer.qna.entity.QnaEntity;

public interface QnaRepository extends JpaRepository<QnaEntity, Long> {
    // 오늘 날짜로 시작하는 qna_id 중 최대값 구하기
    @Query("SELECT MAX(q.qnaId) FROM QnaEntity q WHERE CONCAT('' , q.qnaId) LIKE CONCAT(:dateStr, '%')")
    Long findMaxIdByDate(@org.springframework.data.repository.query.Param("dateStr") String dateStr);

    // qnaNo의 최대값
    @Query("SELECT MAX(q.qnaNo) FROM QnaEntity q")
    Long findMaxQnaNo();

    // qnaNo로 상세 조회
    Optional<QnaEntity> findByQnaNo(@Param("qnaNo") Long qnaNo);
    
    // qnaId로 상세 조회
    Optional<QnaEntity> findByQnaId(@Param("qnaId") Long qnaId);
}
